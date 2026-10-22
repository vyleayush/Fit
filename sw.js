const CACHE_NAME = 'dorfie-fit-v1';
const PRECACHE_URLS = [
    './',
    './index.html',
    './css/style.css',
    './js/script.js',
    './js/policy-data.js',
    './TEXT LOGO.png',
    './Gymming.png',
    './Chilling_Looking_At_Sky.png',
    './Running_Marathon.png',
    './Coffee.png',
    './Accounts.png',
    './Pharmacy.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
            .catch((err) => {
                // Graceful fallback if any asset fails to pre-cache
                console.warn('[SW] Pre-cache partial fail:', err);
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Stale-While-Revalidate for local assets and CDN styles/scripts/fonts
    const isLocalAsset = url.origin === self.location.origin;
    const isCdn = url.hostname.includes('googleapis.com') ||
                  url.hostname.includes('gstatic.com') ||
                  url.hostname.includes('cdnjs.cloudflare.com') ||
                  url.hostname.includes('cdn.jsdelivr.net') ||
                  url.hostname.includes('unpkg.com');

    if (isLocalAsset || isCdn) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => cachedResponse);

                    return cachedResponse || fetchPromise;
                });
            })
        );
    }
});
