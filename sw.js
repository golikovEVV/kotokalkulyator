// Котокалькулятор: работает без интернета после первого открытия.
// Сначала берём свежую версию из сети, а если сети нет — из кэша.
const CACHE = 'kitty-calc-2209245d';
const FILES = ['./', './index.html', './manifest.webmanifest',
               './apple-touch-icon.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    // cache: 'no-cache' — всегда спрашиваем GitHub, не появилась ли новая версия
    fetch(e.request, { cache: 'no-cache' })
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
