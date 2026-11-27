// Merkt sich die gewählte Sprache (nur im eigenen Browser, siehe Datenschutz).
document.querySelectorAll('[data-lang]').forEach(function (a) {
  a.addEventListener('click', function () { try { localStorage.setItem('bk-lang', a.dataset.lang); } catch (e) {} });
});
