const CACHE_STATIC_NAME = 'static-v2';
const API_URL = "http://localhost:2910";
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const STATIC_FILES = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/static/js/0.chunk.js',
    '/static/js/0.chunk.js.map',
    '/static/js/main.chunk.js',
    '/app-icon-144x144.png',
    '/favicon.ico',
    '/offline.html',
    '/manifest.json'
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

function isInArray(string, array) {
    let cachePath;
    if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
        cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else {
        cachePath = string; // store the full request (for CDNs)
    }
    return array.indexOf(cachePath) > -1;
}
this.addEventListener('fetch', async (event) => {
    if (isInArray(event.request.url, STATIC_FILES)) {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response
            }))
    }
    else if (navigator.onLine) {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                if (response) {
                    fetch(event.request)
                        .then(function (res) {
                            caches.open(CACHE_DYNAMIC_NAME)
                                .then(function (cache) {
                                    cache.put(event.request.url, res.clone());
                                })
                        })
                    return response
                } else {
                    return fetch(event.request)
                        .then(function (res) {
                            return caches.open(CACHE_DYNAMIC_NAME)
                                .then(function (cache) {
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        })
                }
            }))
    }
    else {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                if (response) {
                    return response
                }
                else if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/offline.html');
                } else {
                    return new Response();
                }
            })
        )
    }
});

this.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
})

this.addEventListener('notificationclose', (event) => {
    const notification = event.notification;
})

this.addEventListener('push', (event) => {
    let data = { title: "New!!", content: "Something New Happened!!" }
    if (event.data.text()) {
        data = JSON.parse(event.data.text())
    }
    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.icon,
    };
    event.waitUntil(
        this.registration.showNotification(data.title, options)
    )
});
const postData = (data) => {
    for (let dt of data) {
        const exercise = JSON.stringify({
            username: dt.username,
            description: dt.description,
            duration: dt.duration,
            date: dt.date,
        });
        fetch(`http://localhost:2910/exercises/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: exercise
        }).then((res) => {
            if (res.ok) {
                res.json()
                    .then(function () {
                        initializeStore('delete', 'sync-exercise-logs', dt.username)
                    });
            }
        }).catch(function (err) {
            console.log('Error while sending data', err);
        });
    }
}
const initializeStore = (action, st, dataToDelete) => {
    const result = indexedDB.open('exercise-store', 1);
    result.onsuccess = (event) => {
        const db = event.target.result;
        const tx = db.transaction(st, 'readwrite');
        const store = tx.objectStore(st);
        store.getAll().onsuccess = (event) => {
            const res = event.target.result;
            if (action === 'save') {
                postData(res);
            } else {
                store.delete(dataToDelete);
            }
        }
    }
}

const readAllData = (st) => {
    initializeStore('save', st);
}
this.addEventListener('sync', function (event) {
    if (event.tag === 'sync-new-posts') {
        console.log('[Service Worker] Syncing new Posts');
        event.waitUntil(readAllData('sync-exercise-logs'));
    }
})

/**
 *  Note: Caching Strategies
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err) {
              return caches.open(CACHE_STATIC_NAME)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(res) {
        return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
      })
      .catch(function(err) {
        return caches.match(event.request);
      })
  );
});

Cache-only
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
  );
});

Network-only
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request)
  );
});
*/