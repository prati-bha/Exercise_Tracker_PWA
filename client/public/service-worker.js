const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v2';
const STATIC_FILES = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/static/js/0.chunk.js',
    '/static/js/0.chunk.js.map',
    '/static/js/main.chunk.js',
    '/app-icon-144x144.png',
    '/login',
    '/favicon.ico',
    '/offline.html'
];

this.addEventListener('install', function (event) {
    console.log('[service worker ]installevent', event)
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                console.log('[Service Worker] Precaching App Shell');
                cache.addAll(STATIC_FILES);
            })
    )
})

this.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('[Service Worker] Removing old cache.', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});
this.addEventListener('fetch', (event) => {
    console.log("[from service worker]", event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response
            } else {
                fetch(event.request.url).then(async (res) => {
                    return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
                        cache.put(event.request.url, res.clone())
                        return res
                    });
                }).catch(async (err) => {
                    console.log("error test error", err)
                    return caches.open(CACHE_STATIC_NAME)
                        .then(function (cache) {
                            console.log("coming here", cache)
                            return cache.match('/offline.html');
                        })
                });
            }
        })
    );
})