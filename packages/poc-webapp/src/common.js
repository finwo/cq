// Implement 'href' attribute for all elements
[...document.body.querySelectorAll('[href]')].forEach(el => {
    if (el.tagName.toLowerCase() == 'a') return;
    if (getComputedStyle(el).display == 'none') return;
    el.onclick = () => document.location.href = el.getAttribute('href');
    el.style.cursor = 'pointer';
});

// We'll use this plenty
window.Buffer = require('buffer').Buffer;
