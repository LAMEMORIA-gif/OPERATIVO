// Service Worker de Control operativo — abre sin conexión a internet después de haberla visitado una vez con conexión.
// Network-first: revisa internet y solo usa la copia guardada si no hay conexión (se actualiza sola).
const CACHE_NAME = 'operativo-guardia-v3';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE_NAME).then(c => Promise.all(ASSETS.map(u => c.add(u).catch(() => {}))))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request, { cache: 'no-store' }).then(r => { if (r && r.status === 200 && r.type === 'basic') { const cp = r.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, cp)); } return r; }).catch(() => caches.match(e.request).then(c => c || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined))));
});
