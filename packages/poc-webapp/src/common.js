window.Buffer   = require('buffer').Buffer;
window.supercop = require('supercop');

// Implement 'href' attribute for all elements
[...document.body.querySelectorAll('[href]')].forEach(el => {
  if (el.tagName.toLowerCase() == 'a') return;
  if (getComputedStyle(el).display == 'none') return;
  el.onclick = () => document.location.href = el.getAttribute('href');
  el.style.cursor = 'pointer';
});

window.sha2_256 = async function(subject, e) {
  return Buffer.from(await window.crypto.subtle.digest("SHA-256", window.Buffer.from(subject, e)));
};

window.base64url = {
  _padString(subject) {
    const diff = subject.length % 4;
    if (!diff) return subject;
    return subject + "=".repeat(4 - diff);
  },
  decode(subject) {
    subject = subject.toString();
    return base64url._padString(subject)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
  },
  encode(subject) {
    return subject
      .replace(/=/g,"")
      .replace(/\+/g,"-")
      .replace(/\//g,"_")
  },
  toBuffer(subject) {
    return Buffer.from(base64url.decode(subject), 'base64');
  },
  fromBuffer(subject) {
    return base64url.encode(Buffer.from(subject).toString('base64'));
  },
};

window.getdoc = function(path) {
  const rawdoc = window.localStorage.getItem(path);
  if (!rawdoc) return null;
  let [body, signature] = rawdoc.split('.');
  const data = JSON.parse(base64url.toBuffer(body).toString());
  signature  = base64url.toBuffer(signature);
  return Object.assign(Object.create({
    _signature    : signature,
    _signatureData: body,
  }), data);
}
