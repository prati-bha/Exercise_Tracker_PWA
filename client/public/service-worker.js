this.addEventListener('install', function (event) {
    console.log('installevent', event)
})

this.addEventListener('activate', function (event) {
    console.log('Claiming control');
    return self.clients.claim();
});

this.addEventListener('fetch', (event) => {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request.url);
        })
    );
})