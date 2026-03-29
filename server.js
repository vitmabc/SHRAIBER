import { createServer } from 'http';
import {
    readFileSync,
    writeFileSync,
    existsSync,
    statSync,
    mkdirSync
} from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { randomBytes, timingSafeEqual } from 'crypto';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, 'dist');
const CONTENT_FILE = join(__dirname, 'content.json');
const CONTACT_MESSAGES_FILE = join(__dirname, 'contact-messages.json');
const UPLOAD_DIR = join(__dirname, 'uploads');
const LEGACY_UPLOAD_DIR = join(DIST, 'uploads');
const ADMIN_DIR = join(__dirname, 'admin');

const MAX_JSON_BODY_BYTES = 256 * 1024;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;
const CONTACT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_MAX_ATTEMPTS = 6;
const ALLOWED_UPLOAD_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
]);
const ALLOWED_UPLOAD_EXTENSIONS = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif'
]);

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

loadEnv();

const adminPassword = process.env.ADMIN_PASSWORD?.trim();
if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD is required. Set it in the environment or .env file before starting the server.');
}

let port = process.env.PORT || 3000;
let host = process.env.HOST || '0.0.0.0';

for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--port=')) port = arg.split('=')[1];
    if (arg.startsWith('--host=')) host = arg.split('=')[1];
}

if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

const tokens = new Map();
const loginAttempts = new Map();
const contactAttempts = new Map();

function loadEnv() {
    const envPath = join(__dirname, '.env');
    if (!existsSync(envPath)) return;

    readFileSync(envPath, 'utf-8').split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const [key, ...rest] = trimmed.split('=');
        if (!key || rest.length === 0) return;
        process.env[key.trim()] = rest.join('=').trim();
    });
}

function setSecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

function setApiHeaders(req, res) {
    setSecurityHeaders(res);

    const origin = req.headers.origin;
    const expectedOrigin = req.headers.host ? `http://${req.headers.host}` : '';

    if (origin && origin === expectedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function cleanupExpiredTokens() {
    const now = Date.now();
    for (const [token, expiresAt] of tokens.entries()) {
        if (expiresAt <= now) tokens.delete(token);
    }
}

function generateToken() {
    cleanupExpiredTokens();
    const token = randomBytes(32).toString('hex');
    tokens.set(token, Date.now() + TOKEN_TTL_MS);
    return token;
}

function checkAuth(req) {
    cleanupExpiredTokens();
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return false;

    const token = auth.slice(7);
    const expiresAt = tokens.get(token);
    if (!expiresAt) return false;
    if (expiresAt <= Date.now()) {
        tokens.delete(token);
        return false;
    }

    tokens.set(token, Date.now() + TOKEN_TTL_MS);
    return true;
}

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
        return forwarded.split(',')[0].trim();
    }

    return req.socket.remoteAddress || 'unknown';
}

function registerAttempt(bucket, key, windowMs) {
    const now = Date.now();
    const attempts = (bucket.get(key) || []).filter(ts => now - ts < windowMs);
    attempts.push(now);
    bucket.set(key, attempts);
    return attempts.length;
}

function getRecentAttemptCount(bucket, key, windowMs) {
    const now = Date.now();
    const attempts = (bucket.get(key) || []).filter(ts => now - ts < windowMs);
    if (attempts.length) {
        bucket.set(key, attempts);
    } else {
        bucket.delete(key);
    }
    return attempts.length;
}

function clearAttempts(bucket, key) {
    bucket.delete(key);
}

function safePasswordEqual(input, secret) {
    const inputBuffer = Buffer.from(String(input ?? ''));
    const secretBuffer = Buffer.from(secret);

    if (inputBuffer.length !== secretBuffer.length) return false;
    return timingSafeEqual(inputBuffer, secretBuffer);
}

function readBody(req, maxBytes) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let totalBytes = 0;

        req.on('data', chunk => {
            totalBytes += chunk.length;
            if (totalBytes > maxBytes) {
                const error = new Error('Payload too large');
                error.statusCode = 413;
                req.destroy(error);
                return;
            }
            chunks.push(chunk);
        });

        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

function readJson(req, maxBytes = MAX_JSON_BODY_BYTES) {
    return readBody(req, maxBytes).then(buffer => {
        if (!buffer.length) return {};
        return JSON.parse(buffer.toString('utf-8'));
    });
}

function sendJSON(res, data, status = 200) {
    setSecurityHeaders(res);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

function sendError(res, status, error) {
    sendJSON(res, { error }, status);
}

function parseMultipart(buffer, boundary) {
    const parts = [];
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    let pos = 0;

    while (pos < buffer.length) {
        const start = buffer.indexOf(boundaryBuffer, pos);
        if (start === -1) break;

        const nextStart = buffer.indexOf(boundaryBuffer, start + boundaryBuffer.length);
        if (nextStart === -1) break;

        const partData = buffer.slice(start + boundaryBuffer.length, nextStart);
        const headerEnd = partData.indexOf('\r\n\r\n');
        if (headerEnd === -1) {
            pos = nextStart;
            continue;
        }

        const headers = partData.slice(0, headerEnd).toString();
        const body = partData.slice(headerEnd + 4, partData.length - 2);

        const nameMatch = headers.match(/name="([^"]+)"/);
        const filenameMatch = headers.match(/filename="([^"]+)"/);
        const contentTypeMatch = headers.match(/Content-Type:\s*(.+)/i);

        parts.push({
            name: nameMatch?.[1],
            filename: filenameMatch?.[1],
            contentType: contentTypeMatch?.[1]?.trim().toLowerCase(),
            data: body
        });

        pos = nextStart;
    }

    return parts;
}

function isAllowedUpload(filePart) {
    const extension = extname(filePart.filename || '').toLowerCase();
    return (
        ALLOWED_UPLOAD_EXTENSIONS.has(extension) &&
        ALLOWED_UPLOAD_MIME_TYPES.has(filePart.contentType || '')
    );
}

function sanitizeContent(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('Invalid content payload');
    }

    return payload;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function normalizeContactMessage(payload) {
    const name = String(payload.name || '').trim();
    const email = String(payload.email || '').trim();
    const subject = String(payload.subject || '').trim();
    const message = String(payload.message || '').trim();
    const website = String(payload.website || '').trim();

    if (website) {
        throw new Error('Spam detected');
    }
    if (!name || name.length > 120) {
        throw new Error('Name is required and must be shorter than 120 characters');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180) {
        throw new Error('A valid email is required');
    }
    if (subject.length > 120) {
        throw new Error('Subject must be shorter than 120 characters');
    }
    if (!message || message.length > 5000) {
        throw new Error('Message is required and must be shorter than 5000 characters');
    }

    return {
        id: randomBytes(8).toString('hex'),
        name: escapeHtml(name),
        email: escapeHtml(email),
        subject: escapeHtml(subject),
        message: escapeHtml(message),
        createdAt: new Date().toISOString()
    };
}

function readContactMessages() {
    if (!existsSync(CONTACT_MESSAGES_FILE)) return [];

    try {
        const raw = readFileSync(CONTACT_MESSAGES_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveContactMessage(message) {
    const existing = readContactMessages();
    existing.unshift(message);
    writeFileSync(CONTACT_MESSAGES_FILE, JSON.stringify(existing.slice(0, 200), null, 2), 'utf-8');
}

const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || `${host}:${port}`}`);
    const pathname = url.pathname;

    if (pathname.startsWith('/api/')) {
        setApiHeaders(req, res);
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }
    } else {
        setSecurityHeaders(res);
    }

    if (pathname === '/api/login' && req.method === 'POST') {
        const clientIp = getClientIp(req);
        if (getRecentAttemptCount(loginAttempts, clientIp, LOGIN_WINDOW_MS) >= LOGIN_MAX_ATTEMPTS) {
            sendError(res, 429, 'Too many login attempts. Please try again later.');
            return;
        }

        try {
            const body = await readJson(req);
            if (safePasswordEqual(body.password, adminPassword)) {
                clearAttempts(loginAttempts, clientIp);
                const token = generateToken();
                sendJSON(res, { token, expiresInMs: TOKEN_TTL_MS });
            } else {
                registerAttempt(loginAttempts, clientIp, LOGIN_WINDOW_MS);
                sendError(res, 401, 'Invalid password');
            }
        } catch (error) {
            const statusCode = error?.statusCode || 400;
            sendError(res, statusCode, statusCode === 413 ? 'Payload too large' : 'Bad request');
        }
        return;
    }

    if (pathname === '/api/content' && req.method === 'GET') {
        if (!checkAuth(req)) {
            sendError(res, 401, 'Unauthorized');
            return;
        }

        try {
            const data = readFileSync(CONTENT_FILE, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(data);
        } catch {
            sendJSON(res, {}, 200);
        }
        return;
    }

    if (pathname === '/api/content' && req.method === 'POST') {
        if (!checkAuth(req)) {
            sendError(res, 401, 'Unauthorized');
            return;
        }

        try {
            const data = sanitizeContent(await readJson(req));
            writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');
            sendJSON(res, { success: true });
        } catch (error) {
            const statusCode = error?.statusCode || 400;
            sendError(res, statusCode, statusCode === 413 ? 'Payload too large' : 'Failed to save content');
        }
        return;
    }

    if (pathname === '/api/upload' && req.method === 'POST') {
        if (!checkAuth(req)) {
            sendError(res, 401, 'Unauthorized');
            return;
        }

        try {
            const contentType = String(req.headers['content-type'] || '');
            const boundary = contentType.split('boundary=')[1];
            if (!boundary) {
                sendError(res, 400, 'No multipart boundary found');
                return;
            }

            const body = await readBody(req, MAX_UPLOAD_BYTES);
            const parts = parseMultipart(body, boundary);
            const filePart = parts.find(part => part.filename);

            if (!filePart) {
                sendError(res, 400, 'No file uploaded');
                return;
            }
            if (!isAllowedUpload(filePart)) {
                sendError(res, 400, 'Only JPG, PNG, WEBP, and GIF images are allowed');
                return;
            }
            if (filePart.data.length > MAX_UPLOAD_BYTES) {
                sendError(res, 413, 'File too large');
                return;
            }

            const extension = extname(filePart.filename).toLowerCase();
            const safeName = `upload_${Date.now()}_${randomBytes(6).toString('hex')}${extension}`;
            const filePath = join(UPLOAD_DIR, safeName);

            writeFileSync(filePath, filePart.data);
            sendJSON(res, { path: `uploads/${safeName}`, url: `/uploads/${safeName}` });
        } catch (error) {
            const statusCode = error?.statusCode || 500;
            sendError(res, statusCode, statusCode === 413 ? 'File too large' : 'Upload failed');
        }
        return;
    }

    if (pathname === '/api/contact' && req.method === 'POST') {
        const clientIp = getClientIp(req);
        if (getRecentAttemptCount(contactAttempts, clientIp, CONTACT_WINDOW_MS) >= CONTACT_MAX_ATTEMPTS) {
            sendError(res, 429, 'Too many contact requests. Please try again later.');
            return;
        }

        try {
            const payload = await readJson(req);
            const message = normalizeContactMessage(payload);
            registerAttempt(contactAttempts, clientIp, CONTACT_WINDOW_MS);
            saveContactMessage(message);
            sendJSON(res, { success: true });
        } catch (error) {
            const statusCode = error?.statusCode || 400;
            sendError(res, statusCode, statusCode === 413 ? 'Payload too large' : error.message || 'Invalid contact request');
        }
        return;
    }

    if (pathname === '/api/inquiries' && req.method === 'GET') {
        if (!checkAuth(req)) {
            sendError(res, 401, 'Unauthorized');
            return;
        }

        sendJSON(res, { inquiries: readContactMessages() });
        return;
    }

    if (pathname === '/content.json' && req.method === 'GET') {
        try {
            const data = readFileSync(CONTENT_FILE, 'utf-8');
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-cache'
            });
            res.end(data);
        } catch {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end('{}');
        }
        return;
    }

    if (pathname === '/admin' || pathname === '/admin/') {
        try {
            const data = readFileSync(join(ADMIN_DIR, 'index.html'));
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Admin panel not found');
        }
        return;
    }

    if (pathname.startsWith('/admin/')) {
        try {
            const adminRelativePath = pathname.slice('/admin/'.length);
            const adminFilePath = join(ADMIN_DIR, basename(adminRelativePath));

            if (!existsSync(adminFilePath) || !statSync(adminFilePath).isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Admin asset not found');
                return;
            }

            const data = readFileSync(adminFilePath);
            const extension = extname(adminFilePath);
            const mimeType = MIME_TYPES[extension] || 'application/octet-stream';

            res.writeHead(200, {
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache'
            });
            res.end(data);
        } catch {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Internal Server Error');
        }
        return;
    }

    let filePath;
    if (pathname.startsWith('/uploads/')) {
        const uploadFileName = basename(pathname);
        const primaryUploadPath = join(UPLOAD_DIR, uploadFileName);
        const legacyUploadPath = join(LEGACY_UPLOAD_DIR, uploadFileName);

        filePath = existsSync(primaryUploadPath) ? primaryUploadPath : legacyUploadPath;
    } else {
        filePath = join(DIST, pathname === '/' ? 'index.html' : pathname);
    }

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        filePath = join(DIST, 'index.html');
    }

    const extension = extname(filePath);
    const mimeType = MIME_TYPES[extension] || 'application/octet-stream';

    try {
        const data = readFileSync(filePath);
        const cacheControl = extension === '.html'
            ? 'no-cache'
            : 'public, max-age=31536000, immutable';

        res.writeHead(200, {
            'Content-Type': mimeType,
            'Cache-Control': cacheControl
        });
        res.end(data);
    } catch {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Internal Server Error');
    }
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
    console.log(`Admin panel: http://${host}:${port}/admin`);
});
