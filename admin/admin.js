let content = {};
let token = '';
let inquiries = [];

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ═══ AUTH ═══
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        if (res.ok) {
            const data = await res.json();
            token = data.token;
            sessionStorage.setItem('admin_token', token);
            showAdmin();
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    } catch (err) {
        document.getElementById('loginError').textContent = 'Помилка з\'єднання';
        document.getElementById('loginError').style.display = 'block';
    }
});

// Check existing session
const savedToken = sessionStorage.getItem('admin_token');
if (savedToken) {
    token = savedToken;
    showAdmin();
}

async function showAdmin() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').classList.add('active');
    await loadContent();
    await loadInquiries();
}

function logout() {
    token = '';
    sessionStorage.removeItem('admin_token');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').classList.remove('active');
    document.getElementById('loginPassword').value = '';
}

// ═══ CONTENT ═══
async function loadContent() {
    try {
        const res = await fetch('/api/content', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) { logout(); return; }
        content = await res.json();
        populateFields();
    } catch (err) {
        showToast('Помилка завантаження контенту', 'error');
    }
}

async function loadInquiries() {
    try {
        const res = await fetch('/api/inquiries', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) { logout(); return; }
        const data = await res.json();
        inquiries = Array.isArray(data.inquiries) ? data.inquiries : [];
        renderInquiries();
    } catch (err) {
        showToast('Помилка завантаження звернень', 'error');
    }
}

function populateFields() {
    // Simple fields
    document.querySelectorAll('[data-field]').forEach(el => {
        const path = el.getAttribute('data-field');
        const value = getNestedValue(content, path);
        if (value !== undefined) {
            el.value = value;
        }
    });

    // Values
    renderValues();

    // News
    renderNews();
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
}

function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((o, k) => {
        if (!(k in o)) o[k] = {};
        return o[k];
    }, obj);
    target[last] = value;
}

function collectFields() {
    document.querySelectorAll('[data-field]').forEach(el => {
        const path = el.getAttribute('data-field');
        setNestedValue(content, path, el.value);
    });

    // Collect values
    collectValues();

    // Collect news
    collectNews();
}

async function saveContent() {
    collectFields();

    try {
        const res = await fetch('/api/content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(content)
        });

        if (res.status === 401) { logout(); return; }

        if (res.ok) {
            showToast('✅ Збережено успішно!', 'success');
        } else {
            showToast('Помилка збереження', 'error');
        }
    } catch (err) {
        showToast('Помилка з\'єднання', 'error');
    }
}

// ═══ VALUES ═══
function renderValues() {
    const container = document.getElementById('valuesContainer');
    if (!content.values) return;
    container.innerHTML = content.values.map((v, i) => `
        <div class="value-card">
            <div class="value-card__header">
                <span class="value-card__num">${i + 1}</span>
                Цінність #${i + 1}
            </div>
            <div class="field-row">
                <div class="form-group">
                    <label>Назва (UA)</label>
                    <input type="text" data-value="${i}" data-vfield="title_ua" value="${escapeHtml(v.title_ua || '')}">
                </div>
                <div class="form-group">
                    <label>Назва (EN)</label>
                    <input type="text" data-value="${i}" data-vfield="title_en" value="${escapeHtml(v.title_en || '')}">
                </div>
            </div>
            <div class="form-group">
                <label>Опис (UA)</label>
                <textarea data-value="${i}" data-vfield="text_ua" rows="2">${escapeHtml(v.text_ua || '')}</textarea>
            </div>
            <div class="form-group">
                <label>Опис (EN)</label>
                <textarea data-value="${i}" data-vfield="text_en" rows="2">${escapeHtml(v.text_en || '')}</textarea>
            </div>
        </div>
    `).join('');
}

function collectValues() {
    if (!content.values) return;
    content.values.forEach((v, i) => {
        document.querySelectorAll(`[data-value="${i}"]`).forEach(el => {
            const field = el.getAttribute('data-vfield');
            v[field] = el.value;
        });
    });
}

// ═══ NEWS ═══
function renderNews() {
    const container = document.getElementById('newsContainer');
    if (!content.news) return;
    container.innerHTML = content.news.map((n, i) => `
        <div class="news-item">
            <div class="news-item__header">
                <span class="news-item__number">${i + 1}</span>
                <button class="btn btn-danger" onclick="removeNewsItem(${i})" style="padding: 6px 12px; font-size: 0.75rem;">🗑️ Видалити</button>
            </div>
            <div class="field-row">
                <div class="form-group">
                    <label>Заголовок (UA)</label>
                    <input type="text" data-news="${i}" data-nfield="title_ua" value="${escapeHtml(n.title_ua || '')}">
                </div>
                <div class="form-group">
                    <label>Заголовок (EN)</label>
                    <input type="text" data-news="${i}" data-nfield="title_en" value="${escapeHtml(n.title_en || '')}">
                </div>
            </div>
            <div class="form-group">
                <label>Текст (UA)</label>
                <textarea data-news="${i}" data-nfield="text_ua" rows="2">${escapeHtml(n.text_ua || '')}</textarea>
            </div>
            <div class="form-group">
                <label>Текст (EN)</label>
                <textarea data-news="${i}" data-nfield="text_en" rows="2">${escapeHtml(n.text_en || '')}</textarea>
            </div>
            <div class="field-row">
                <div class="form-group">
                    <label>Дата</label>
                    <input type="text" data-news="${i}" data-nfield="date" value="${escapeHtml(n.date || '')}" placeholder="ДД.ММ.РРРР">
                </div>
                <div class="form-group">
                    <label>Зображення</label>
                    <div class="image-upload" onclick="this.querySelector('input[type=file]').click()">
                        ${n.image ? `<img src="/${escapeHtml(n.image)}" alt="preview">` : '<div class="placeholder"><span class="icon">📷</span>Натисніть для завантаження</div>'}
                        <input type="file" accept="image/*" onchange="uploadNewsImage(${i}, this)">
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderInquiries() {
    const container = document.getElementById('inquiriesContainer');
    if (!container) return;

    if (!inquiries.length) {
        container.innerHTML = '<div class="news-item">Поки що нових звернень немає.</div>';
        return;
    }

    container.innerHTML = inquiries.map(item => `
        <div class="inquiry-item">
            <h4>${escapeHtml(item.name || 'Без імені')}</h4>
            <div class="inquiry-item__meta">
                <div>${escapeHtml(item.email || '')}</div>
                <div>${escapeHtml(item.subject || 'Без теми')}</div>
                <div>${escapeHtml(item.createdAt || '')}</div>
            </div>
            <div class="inquiry-item__body">${escapeHtml(item.message || '')}</div>
        </div>
    `).join('');
}

function collectNews() {
    if (!content.news) return;
    content.news.forEach((n, i) => {
        document.querySelectorAll(`[data-news="${i}"]`).forEach(el => {
            const field = el.getAttribute('data-nfield');
            if (field) n[field] = el.value;
        });
    });
}

function addNewsItem() {
    if (!content.news) content.news = [];
    content.news.unshift({
        title_ua: 'Нова новина',
        title_en: 'New Article',
        text_ua: '',
        text_en: '',
        date: new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        image: 'images/lyceum-real.jpg'
    });
    renderNews();
}

function removeNewsItem(index) {
    if (confirm('Видалити цю новину?')) {
        content.news.splice(index, 1);
        renderNews();
    }
}

async function uploadNewsImage(index, input) {
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            content.news[index].image = data.path;
            renderNews();
            showToast('📷 Зображення завантажено', 'success');
        }
    } catch (err) {
        showToast('Помилка завантаження файлу', 'error');
    }
}

// ═══ NAVIGATION ═══
const sectionTitles = {
    hero: 'Головний екран',
    about: 'Про ліцей',
    values: 'Цінності',
    news: 'Новини',
    contacts: 'Контакти',
    inquiries: 'Звернення'
};

document.querySelectorAll('.sidebar__link[data-section]').forEach(link => {
    link.addEventListener('click', () => {
        const section = link.getAttribute('data-section');

        // Update active link
        document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Show panel
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`panel-${section}`)?.classList.add('active');

        // Update title
        document.getElementById('sectionTitle').textContent = sectionTitles[section] || section;

        if (section === 'inquiries') {
            loadInquiries();
        }
    });
});

// ═══ TOAST ═══
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ═══ KEYBOARD SHORTCUT ═══
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveContent();
    }
});
