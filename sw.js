// Offline support for the installed app: fresh copy from the network when online,
// cached copy when not. Bump CACHE when the cached file list changes.
var CACHE = 'pallavi-v1';
var CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/css/style.css',
  'assets/js/main.js',
  'assets/img/logo.svg',
  'assets/img/icon-192.png',
  'assets/img/pump-sp1400.jpg',
  'assets/img/night-pour.jpg',
  'assets/img/pump-on-site-poster.jpg',
  'assets/img/slab-pour-poster.jpg',
  'assets/img/hopper-poster.jpg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(CORE); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  var url = new URL(req.url);
  // Videos use range requests; leave them, and anything cross-origin, to the browser.
  if (req.method !== 'GET' || url.origin !== location.origin || req.headers.has('range') || /\.mp4$/.test(url.pathname)) return;

  event.respondWith(
    fetch(req).then(function (res) {
      if (res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error());
      });
    })
  );
});
