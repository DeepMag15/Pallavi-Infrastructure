(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Service workers only run on https or localhost, so this is skipped for file:// previews.
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function () {
    setMenu(!nav.classList.contains('open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });

  var clips = document.querySelectorAll('video.clip');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Without autoplay (reduced motion or old browsers) fall back to native controls.
  if (reduceMotion || !('IntersectionObserver' in window)) {
    clips.forEach(function (v) { v.controls = true; });
    return;
  }

  // Play each clip only while it is on screen.
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        var p = v.play();
        if (p && p.catch) p.catch(function () { v.controls = true; });
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.4 });

  clips.forEach(function (v) { observer.observe(v); });
})();
