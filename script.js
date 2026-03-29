/* ═══════════════════════════════════════════════════════
   SCRIPT — Ліцей родини Шрайбер
   ═══════════════════════════════════════════════════════ */

// ── i18n Translations ─────────────────────────────────
const translations = {
    uk: {
        logo_name: 'Ліцей Шрайбер',
        nav_home: 'Головна',
        nav_about: 'Про ліцей',
        nav_values: 'Цінності',
        nav_education: 'Освіта',
        nav_news: 'Новини',
        nav_gallery: 'Галерея',
        nav_contacts: 'Контакти',
        nav_cta: 'Зв\'язатися',
        hero_subtitle: 'Білоцерківський корпоративний ліцей',
        hero_title_1: 'ОСВІТА',
        hero_title_2: 'НОВОГО',
        hero_title_3: 'ПОКОЛІННЯ',
        hero_description: 'Інноваційний підхід до навчання з індивідуальною увагою до кожного учня. STEAM-освіта, сучасні технології та цінності, що формують лідерів майбутнього.',
        hero_btn_about: 'Дізнатися більше',
        hero_btn_contact: 'Зв\'язатися',
        hero_scroll: 'Прокрутіть вниз',
        about_label: 'ПРО НАС',
        about_title: 'Ліцей родини Шрайбер',
        about_text_1: 'Білоцерківський корпоративний ліцей родини Шрайбер — це сучасний заклад загальної середньої освіти, заснований у 2024 році. Ми поєднуємо найкращі освітні традиції з інноваційними підходами, створюючи середовище, де кожна дитина розкриває свій потенціал.',
        about_text_2: 'Наш ліцей — це місце, де освіта стає захоплюючою пригодою. Ми використовуємо STEAM-підхід, поєднуючи науку, технології, інженерію, мистецтво та математику для всебічного розвитку учнів.',
        about_stat_1: 'учнів у класі',
        about_stat_2: 'мови навчання',
        about_stat_3: '% індивідуальний підхід',
        about_license: 'Ліцензія',
        about_statute: 'Статут закладу',
        values_label: 'НАШІ ЦІННОСТІ',
        values_title: 'Що робить нас особливими',
        value_1_title: 'Академічна досконалість',
        value_1_text: 'Високі стандарти навчання з індивідуальним підходом. Маленькі класи дозволяють приділяти увагу кожному учню.',
        value_2_title: 'Інноваційні технології',
        value_2_text: 'STEAM-підхід, цифрові інструменти та сучасне обладнання. Ми готуємо учнів до викликів майбутнього.',
        value_3_title: 'Спільнота та цінності',
        value_3_text: 'Повага, відповідальність і взаємопідтримка. Ми формуємо не лише знання, а й характер.',
        value_4_title: 'Культурне різноманіття',
        value_4_text: 'Навчання українською, англійською та івритом. Відкритість до світу та збереження традицій.',
        edu_label: 'ОСВІТНІЙ ПРОЦЕС',
        edu_title: 'Як ми навчаємо',
        edu_tag_1: 'STEAM',
        edu_card_1_title: 'Інтегрований STEAM-підхід',
        edu_card_1_text: 'Поєднуємо науку, технології, інженерію, мистецтво та математику в єдину захоплюючу програму навчання.',
        edu_tag_2: 'Педагогіка',
        edu_card_2_title: 'Індивідуальна траєкторія',
        edu_card_2_text: 'Кожен учень — унікальний. Ми створюємо персональний план розвитку, враховуючи інтереси та здібності дитини.',
        edu_tag_3: 'Середовище',
        edu_card_3_title: 'Сучасний простір',
        edu_card_3_text: 'Обладнані класи, сучасна техніка, комфортні зони для навчання та відпочинку — все для ефективного розвитку.',
        edu_doc_title: 'Документи',
        edu_doc_1: 'Наказ про зарахування до 1 класу 2025/2026 н.р.',
        edu_doc_2: 'Атестація педпрацівників 2026 р.',
        news_label: 'НОВИНИ',
        news_title: 'Останні події',
        news_tag_event: 'Подія',
        news_tag_education: 'Освіта',
        news_tag_official: 'Офіційно',
        news_1_title: 'День відкритих дверей 2026',
        news_1_text: 'Запрошуємо батьків та майбутніх учнів познайомитися з нашим ліцеєм, навчальними програмами та педагогічним колективом. Ви зможете побачити наші сучасні класи та поставити питання.',
        news_2_title: 'STEAM-тиждень: наука та творчість',
        news_2_text: 'Учні презентували свої проєкти на перетині науки й мистецтва. Від робототехніки до цифрового живопису.',
        news_3_title: 'Ліцей отримав державну ліцензію',
        news_3_text: 'Ліцей родини Шрайбер офіційно зареєстрований та отримав ліцензію на провадження освітньої діяльності.',
        news_read_more: 'Читати далі →',
        gallery_label: 'ГАЛЕРЕЯ',
        gallery_title: 'Наше життя',
        gallery_campus: 'Наш кампус',
        gallery_learning: 'Навчання',
        gallery_teachers: 'Педагоги',
        gallery_life: 'Шкільне життя',
        gallery_building: 'Будівля',
        contacts_label: 'КОНТАКТИ',
        contacts_title: 'Зв\'яжіться з нами',
        contacts_address_title: 'Адреса',
        contacts_phone_title: 'Телефон',
        contacts_form_title: 'Напишіть нам',
        form_name: 'Ім\'я *',
        form_email: 'Email *',
        form_subject: 'Тема',
        form_subject_default: 'Оберіть тему',
        form_subject_admission: 'Вступ до ліцею',
        form_subject_general: 'Загальне питання',
        form_subject_cooperation: 'Співпраця',
        form_subject_other: 'Інше',
        form_message: 'Повідомлення *',
        form_name_error: 'Будь ласка, введіть ваше ім\'я',
        form_email_error: 'Введіть коректний email',
        form_message_error: 'Будь ласка, введіть повідомлення',
        form_submit: 'Надіслати',
        form_note: '* Обов\'язкові поля. Ваші дані захищені та не передаються третім особам.',
        form_success_title: 'Дякуємо!',
        form_success_text: 'Ваше повідомлення надіслано. Ми зв\'яжемося з вами найближчим часом.',
        footer_name: 'Ліцей родини Шрайбер',
        footer_description: 'Білоцерківський корпоративний ліцей родини Шрайбер — сучасний заклад загальної середньої освіти з інноваційним підходом.',
        footer_nav_title: 'Навігація',
        footer_docs_title: 'Документи',
        footer_copyright: 'Білоцерківський корпоративний ліцей родини Шрайбер. Усі права захищені.',
    },
    en: {
        logo_name: 'Schreiber Lyceum',
        nav_home: 'Home',
        nav_about: 'About',
        nav_values: 'Values',
        nav_education: 'Education',
        nav_news: 'News',
        nav_gallery: 'Gallery',
        nav_contacts: 'Contacts',
        nav_cta: 'Contact Us',
        hero_subtitle: 'Bila Tserkva Corporate Lyceum',
        hero_title_1: 'EDUCATION',
        hero_title_2: 'OF THE NEW',
        hero_title_3: 'GENERATION',
        hero_description: 'An innovative approach to learning with individual attention to every student. STEAM education, modern technologies, and values that shape the leaders of tomorrow.',
        hero_btn_about: 'Learn More',
        hero_btn_contact: 'Contact Us',
        hero_scroll: 'Scroll down',
        about_label: 'ABOUT US',
        about_title: 'Schreiber Family Lyceum',
        about_text_1: 'The Bila Tserkva Corporate Schreiber Family Lyceum is a modern secondary education institution founded in 2024. We combine the best educational traditions with innovative approaches, creating an environment where every child unlocks their potential.',
        about_text_2: 'Our lyceum is a place where education becomes an exciting adventure. We use the STEAM approach, combining science, technology, engineering, arts, and mathematics for the comprehensive development of students.',
        about_stat_1: 'students per class',
        about_stat_2: 'languages',
        about_stat_3: '% individual approach',
        about_license: 'License',
        about_statute: 'Charter',
        values_label: 'OUR VALUES',
        values_title: 'What Makes Us Special',
        value_1_title: 'Academic Excellence',
        value_1_text: 'High learning standards with an individual approach. Small classes allow us to give attention to every student.',
        value_2_title: 'Innovative Technologies',
        value_2_text: 'STEAM approach, digital tools, and modern equipment. We prepare students for the challenges of the future.',
        value_3_title: 'Community & Values',
        value_3_text: 'Respect, responsibility, and mutual support. We build not only knowledge but also character.',
        value_4_title: 'Cultural Diversity',
        value_4_text: 'Teaching in Ukrainian, English, and Hebrew. Openness to the world and preservation of traditions.',
        edu_label: 'EDUCATIONAL PROCESS',
        edu_title: 'How We Teach',
        edu_tag_1: 'STEAM',
        edu_card_1_title: 'Integrated STEAM Approach',
        edu_card_1_text: 'We combine science, technology, engineering, arts, and mathematics into a unified, engaging curriculum.',
        edu_tag_2: 'Pedagogy',
        edu_card_2_title: 'Individual Learning Path',
        edu_card_2_text: 'Each student is unique. We create a personalized development plan, considering the interests and abilities of every child.',
        edu_tag_3: 'Environment',
        edu_card_3_title: 'Modern Space',
        edu_card_3_text: 'Equipped classrooms, modern technology, comfortable areas for learning and rest — everything for effective development.',
        edu_doc_title: 'Documents',
        edu_doc_1: 'Enrollment order for 1st grade 2025/2026',
        edu_doc_2: 'Teacher certification 2026',
        news_label: 'NEWS',
        news_title: 'Latest Events',
        news_tag_event: 'Event',
        news_tag_education: 'Education',
        news_tag_official: 'Official',
        news_1_title: 'Open Day 2026',
        news_1_text: 'We invite parents and prospective students to get acquainted with our lyceum, programs, and teaching staff. You can see our modern classrooms and ask questions.',
        news_2_title: 'STEAM Week: Science & Creativity',
        news_2_text: 'Students presented their projects at the intersection of science and art. From robotics to digital painting.',
        news_3_title: 'Lyceum Received State License',
        news_3_text: 'The Schreiber Family Lyceum is officially registered and has received a license for educational activities.',
        news_read_more: 'Read more →',
        gallery_label: 'GALLERY',
        gallery_title: 'Our Life',
        gallery_campus: 'Our Campus',
        gallery_learning: 'Learning',
        gallery_teachers: 'Teachers',
        gallery_life: 'School Life',
        gallery_building: 'Building',
        contacts_label: 'CONTACTS',
        contacts_title: 'Get in Touch',
        contacts_address_title: 'Address',
        contacts_phone_title: 'Phone',
        contacts_form_title: 'Write to Us',
        form_name: 'Name *',
        form_email: 'Email *',
        form_subject: 'Subject',
        form_subject_default: 'Choose a subject',
        form_subject_admission: 'Admission',
        form_subject_general: 'General Inquiry',
        form_subject_cooperation: 'Cooperation',
        form_subject_other: 'Other',
        form_message: 'Message *',
        form_name_error: 'Please enter your name',
        form_email_error: 'Please enter a valid email',
        form_message_error: 'Please enter your message',
        form_submit: 'Send Message',
        form_note: '* Required fields. Your data is protected and not shared with third parties.',
        form_success_title: 'Thank You!',
        form_success_text: 'Your message has been sent. We will get back to you soon.',
        footer_name: 'Schreiber Family Lyceum',
        footer_description: 'Bila Tserkva Corporate Schreiber Family Lyceum — a modern secondary education institution with an innovative approach.',
        footer_nav_title: 'Navigation',
        footer_docs_title: 'Documents',
        footer_copyright: 'Bila Tserkva Corporate Schreiber Family Lyceum. All rights reserved.',
    }
};

// ── State ─────────────────────────────────────────────
let currentLang = localStorage.getItem('lang') || 'uk';

// ── DOM Elements ──────────────────────────────────────
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const menuOverlay = document.getElementById('menu-overlay');
const langSwitch = document.getElementById('lang-switch');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const contactSubmitButton = document.getElementById('contact-submit');
const contactFormStatus = document.getElementById('contact-form-status');

const contactFormMessages = {
    uk: {
        sending: 'Надсилаємо повідомлення...',
        error: 'Не вдалося надіслати повідомлення. Спробуйте ще раз.',
        rateLimit: 'Забагато звернень. Спробуйте трохи пізніше.'
    },
    en: {
        sending: 'Sending your message...',
        error: 'We could not send your message. Please try again.',
        rateLimit: 'Too many requests. Please try again later.'
    }
};

function getCurrentContactMessages() {
    return contactFormMessages[currentLang] || contactFormMessages.uk;
}

function setElementText(selector, value) {
    document.querySelectorAll(selector).forEach(el => {
        el.textContent = value;
    });
}

function setLinkGroup(selector, hrefValue, textValue) {
    document.querySelectorAll(selector).forEach(el => {
        el.href = hrefValue;
        if (textValue && !el.hasAttribute('aria-label')) {
            el.textContent = textValue;
        }
    });
}

function setMultilineText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    const lines = String(value || '').trim().split(/\n+/);
    el.replaceChildren();

    lines.forEach((line, index) => {
        if (index > 0) {
            el.appendChild(document.createElement('br'));
        }
        el.appendChild(document.createTextNode(line));
    });
}

function formatInstagramLabel(url) {
    const cleanUrl = String(url || '').trim();
    if (!cleanUrl) return '';

    try {
        const parsed = new URL(cleanUrl);
        const handle = parsed.pathname.replace(/\/+$/, '').split('/').filter(Boolean).pop();
        return handle ? `@${handle}` : cleanUrl;
    } catch {
        return cleanUrl;
    }
}

function updateContactDetails(contacts) {
    if (!contacts) return;

    if (contacts.phone) {
        const normalizedPhone = contacts.phone.replace(/\s/g, '');
        setLinkGroup('[data-contact-phone]', `tel:${normalizedPhone}`, contacts.phone);
    }

    if (contacts.email) {
        setLinkGroup('[data-contact-email]', `mailto:${contacts.email}`, contacts.email);
    }

    const addressKey = currentLang === 'uk' ? contacts.address_ua : contacts.address_en;
    if (addressKey) {
        setMultilineText('contact-address', addressKey);
        setMultilineText('footer-address', addressKey);
    }

    if (contacts.instagram) {
        const instagramLabel = formatInstagramLabel(contacts.instagram);
        setLinkGroup('[data-contact-instagram]', contacts.instagram, instagramLabel || undefined);
    }
}

function setContactFormStatus(message = '', isError = false) {
    if (!contactFormStatus) return;
    contactFormStatus.hidden = !message;
    contactFormStatus.textContent = message;
    contactFormStatus.style.color = isError ? '#d64545' : '';
}

// ── Initialize ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHeaderScroll();
    initHamburgerMenu();
    initSmoothScroll();
    initLanguageSwitch();
    initContactForm();
    initCounterAnimation();
    applyLanguage(currentLang);
    loadDynamicContent();
});

// ── Load Dynamic Content from Admin ───────────────────
async function loadDynamicContent() {
    try {
        const res = await fetch('/content.json');
        if (!res.ok) return;
        const c = await res.json();

        // ── Hero ──
        if (c.hero) {
            translations.uk.hero_subtitle = c.hero.subtitle_ua || translations.uk.hero_subtitle;
            translations.en.hero_subtitle = c.hero.subtitle_en || translations.en.hero_subtitle;
            translations.uk.hero_title_1 = c.hero.title_line1_ua || translations.uk.hero_title_1;
            translations.en.hero_title_1 = c.hero.title_line1_en || translations.en.hero_title_1;
            translations.uk.hero_title_2 = c.hero.title_accent_ua || translations.uk.hero_title_2;
            translations.en.hero_title_2 = c.hero.title_accent_en || translations.en.hero_title_2;
            translations.uk.hero_title_3 = c.hero.title_line2_ua || translations.uk.hero_title_3;
            translations.en.hero_title_3 = c.hero.title_line2_en || translations.en.hero_title_3;
            translations.uk.hero_description = c.hero.description_ua || translations.uk.hero_description;
            translations.en.hero_description = c.hero.description_en || translations.en.hero_description;
            translations.uk.hero_btn_contact = c.hero.cta_primary_ua || translations.uk.hero_btn_contact;
            translations.en.hero_btn_contact = c.hero.cta_primary_en || translations.en.hero_btn_contact;
            translations.uk.hero_btn_about = c.hero.cta_secondary_ua || translations.uk.hero_btn_about;
            translations.en.hero_btn_about = c.hero.cta_secondary_en || translations.en.hero_btn_about;
        }

        // ── About ──
        if (c.about) {
            translations.uk.about_label = c.about.label_ua || translations.uk.about_label;
            translations.en.about_label = c.about.label_en || translations.en.about_label;
            translations.uk.about_title = c.about.title_ua || translations.uk.about_title;
            translations.en.about_title = c.about.title_en || translations.en.about_title;
            translations.uk.about_text_1 = c.about.text_ua || translations.uk.about_text_1;
            translations.en.about_text_1 = c.about.text_en || translations.en.about_text_1;

            // Stats
            if (c.about.stat1_value) {
                const el = document.querySelectorAll('[data-count]')[0];
                if (el) el.setAttribute('data-count', c.about.stat1_value);
            }
            if (c.about.stat2_value) {
                const el = document.querySelectorAll('[data-count]')[1];
                if (el) el.setAttribute('data-count', c.about.stat2_value);
            }
            if (c.about.stat3_value) {
                const el = document.querySelectorAll('[data-count]')[2];
                if (el) el.setAttribute('data-count', c.about.stat3_value);
            }
            if (c.about.stat1_label_ua) translations.uk.about_stat_1 = c.about.stat1_label_ua;
            if (c.about.stat1_label_en) translations.en.about_stat_1 = c.about.stat1_label_en;
            if (c.about.stat2_label_ua) translations.uk.about_stat_2 = c.about.stat2_label_ua;
            if (c.about.stat2_label_en) translations.en.about_stat_2 = c.about.stat2_label_en;
            if (c.about.stat3_label_ua) translations.uk.about_stat_3 = c.about.stat3_label_ua;
            if (c.about.stat3_label_en) translations.en.about_stat_3 = c.about.stat3_label_en;
        }

        // ── Values ──
        if (c.values && c.values.length >= 4) {
            c.values.forEach((v, i) => {
                const n = i + 1;
                if (v.title_ua) translations.uk[`value_${n}_title`] = v.title_ua;
                if (v.title_en) translations.en[`value_${n}_title`] = v.title_en;
                if (v.text_ua) translations.uk[`value_${n}_text`] = v.text_ua;
                if (v.text_en) translations.en[`value_${n}_text`] = v.text_en;
            });
        }

        // ── News ──
        if (c.news && c.news.length) {
            const newsCards = document.querySelectorAll('.news__card');
            c.news.forEach((n, i) => {
                if (!newsCards[i]) return;
                const card = newsCards[i];
                // Update i18n keys
                if (n.title_ua) translations.uk[`news_${i+1}_title`] = n.title_ua;
                if (n.title_en) translations.en[`news_${i+1}_title`] = n.title_en;
                if (n.text_ua) translations.uk[`news_${i+1}_text`] = n.text_ua;
                if (n.text_en) translations.en[`news_${i+1}_text`] = n.text_en;
                // Update date
                if (n.date) {
                    const dateEl = card.querySelector('.news__card-date');
                    if (dateEl) dateEl.textContent = n.date;
                }
                // Update image
                if (n.image) {
                    const imgEl = card.querySelector('img');
                    if (imgEl) imgEl.src = n.image;
                }
            });
        }

        // ── Contacts ──
        updateContactDetails(c.contacts);

        // Re-apply language with updated translations
        applyLanguage(currentLang);

    } catch (err) {
        console.log('Content loading skipped:', err.message);
    }
}

// ── Scroll Animations (Intersection Observer) ─────────
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ── Header Background on Scroll ───────────────────────
function initHeaderScroll() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 60) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ── Hamburger Menu ────────────────────────────────────
function initHamburgerMenu() {
    hamburger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a link
    menuOverlay.querySelectorAll('.menu-overlay__link').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });
}

function toggleMenu() {
    hamburger.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
}

function closeMenu() {
    hamburger.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ── Smooth Scroll ─────────────────────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ── Language Switch ───────────────────────────────────
function initLanguageSwitch() {
    langSwitch.addEventListener('click', () => {
        currentLang = currentLang === 'uk' ? 'en' : 'uk';
        localStorage.setItem('lang', currentLang);
        applyLanguage(currentLang);
    });
}

function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Update html lang attribute
    document.documentElement.lang = lang === 'uk' ? 'uk' : 'en';

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update lang switch display
    const currentEl = langSwitch.querySelector('.lang-switch__current');
    const otherEl = langSwitch.querySelector('.lang-switch__other');
    currentEl.textContent = lang.toUpperCase();
    otherEl.textContent = lang === 'uk' ? 'EN' : 'UA';
}

// ── Contact Form ──────────────────────────────────────
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset errors
        contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
        setContactFormStatus('');

        let isValid = true;

        // Validate name
        const name = contactForm.querySelector('#contact-name');
        if (!name.value.trim()) {
            name.closest('.form-group').classList.add('error');
            isValid = false;
        }

        // Validate email
        const email = contactForm.querySelector('#contact-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.closest('.form-group').classList.add('error');
            isValid = false;
        }

        // Validate message
        const message = contactForm.querySelector('#contact-message');
        if (!message.value.trim()) {
            message.closest('.form-group').classList.add('error');
            isValid = false;
        }

        if (!isValid) return;

        const messages = getCurrentContactMessages();
        const payload = {
            name: name.value.trim(),
            email: email.value.trim(),
            subject: contactForm.querySelector('#contact-subject')?.value || '',
            message: message.value.trim(),
            website: contactForm.querySelector('#contact-website')?.value || ''
        };

        try {
            if (contactSubmitButton) {
                contactSubmitButton.disabled = true;
                contactSubmitButton.setAttribute('aria-busy', 'true');
            }
            setContactFormStatus(messages.sending);

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                const statusMessage = response.status === 429
                    ? messages.rateLimit
                    : data.error || messages.error;
                setContactFormStatus(statusMessage, true);
                return;
            }

            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            contactForm.reset();
            setContactFormStatus('');

            setTimeout(() => {
                contactForm.style.display = 'block';
                formSuccess.style.display = 'none';
            }, 5000);
        } catch (error) {
            setContactFormStatus(messages.error, true);
        } finally {
            if (contactSubmitButton) {
                contactSubmitButton.disabled = false;
                contactSubmitButton.removeAttribute('aria-busy');
            }
        }
    });
}

// ── Counter Animation ─────────────────────────────────
function initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}
