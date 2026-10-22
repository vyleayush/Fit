// Self-destructing and cache-clearing Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((k) => caches.delete(k)));
        })
        .then(() => self.registration.unregister())
        .then(() => self.clients.claim())
        .then(() => self.clients.matchAll({ type: 'window' }))
        .then((clients) => {
            clients.forEach((client) => {
                try {
                    client.navigate(client.url);
                } catch (e) {}
            });
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Pure network pass-through, never intercept or serve stale cache
    event.respondWith(fetch(event.request));
});
