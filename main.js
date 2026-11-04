// AOS reveal animations.
if (window.AOS) {
    AOS.init({ offset: 60, once: true, duration: 700 });
}

/* ---------------- mobile dropdown ---------------- */
const hamburg = document.querySelector('.hamburg');
const dropdown = document.getElementById('dropdown');
// Reuse the same icon node instead of rewriting innerHTML: replacing it would
// detach the click target mid-event and trip the outside-click handler below.
const hamburgIcon = hamburg.querySelector('i');

function setMenu(isOpen) {
    dropdown.classList.toggle('open', isOpen);
    hamburg.setAttribute('aria-expanded', String(isOpen));
    hamburg.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    hamburgIcon.classList.toggle('fa-bars', !isOpen);
    hamburgIcon.classList.toggle('fa-xmark', isOpen);
}

function closeMenu() {
    setMenu(false);
}

hamburg.addEventListener('click', () => {
    setMenu(!dropdown.classList.contains('open'));
});

// Close the menu once a link is tapped so the target section is visible.
dropdown.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !hamburg.contains(e.target)) {
        closeMenu();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

/* ---------------- navbar shadow on scroll ---------------- */
const navbar = document.getElementById('navbar');

function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------------- active nav link while scrolling ---------------- */
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

function setActive(id) {
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
}

if ('IntersectionObserver' in window && sections.length) {
    const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
    ) || 72;

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setActive(visible.target.id);
        },
        {
            // Shift the viewport box down past the navbar so the section
            // sitting under it isn't counted as the current one.
            rootMargin: `-${navHeight + 10}px 0px -55% 0px`,
            threshold: [0.01, 0.25, 0.5]
        }
    );

    sections.forEach((section) => observer.observe(section));
}

/* ---------------- typewriter ---------------- */
const roles = [
    'Machine Learning Developer',
    'IoT & Embedded Tinkerer',
    'Data Enthusiast',
    'CS Undergraduate'
];

const typedRole = document.getElementById('typed-role');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
    const current = roles[roleIndex];

    if (deleting) {
        charIndex -= 1;
        typedRole.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            return setTimeout(typeLoop, 350);
        }
        return setTimeout(typeLoop, 35);
    }

    charIndex += 1;
    typedRole.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
        deleting = true;
        return setTimeout(typeLoop, 1600);
    }
    return setTimeout(typeLoop, 70);
}

if (typedRole) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typedRole.textContent = roles[0];
    } else {
        typeLoop();
    }
}

/* ---------------- contact form -> mailto ---------------- */
const form = document.getElementById('contact-form');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        const subject = `Portfolio enquiry from ${name}`;
        const body = `${message}\n\nFrom: ${name}\n${email}`;

        window.location.href =
            `mailto:naini.anish@gmail.com?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;
    });
}
