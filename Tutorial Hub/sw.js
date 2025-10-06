/**
 * Service Worker for iPseudo Tutorial Hub
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'ipseudo-tutorial-v1';
const RUNTIME_CACHE = 'ipseudo-runtime-v1';

// Core files to cache on install
const CORE_ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './css/tutorial.css',
    './css/reading-controls.css',
    './js/script.js',
    './js/tutorial-features.js',
    './js/reading-controls.js',
    './js/syntax-highlighter.js',
    './js/quick-jump.js',
    './js/global-search.js',
    './assets/app-icon.svg',
    './manifest.json'
];

// Lesson pages
const LESSON_PAGES = [
    './01-introduction-to-pseudocode.html',
    './02-getting-started.html',
    './03-variables-and-data-types.html',
    './04-input-and-output.html',
    './05-operators.html',
    './06-comments-and-documentation.html',
    './07-conditional-statements.html',
    './08-loops.html',
    './09-nested-loops.html',
    './10-functions.html',
    './11-procedures.html',
    './12-arrays.html',
    './13-string-operations.html',
    './14-multidimensional-arrays.html',
    './15-recursion.html',
    './16-sorting-algorithms.html',
    './17-searching-algorithms.html',
    './18-data-structures.html',
    './19-algorithm-design-patterns.html',
    './20-best-practices.html',
    './my-notes.html',
    './statistics.html',
    './contact.html'
];

// Exercise pages
const EXERCISE_PAGES = [
    './Exercises/exercises-index.html',
    './Exercises/exercises-variables.html',
    './Exercises/exercises-operators.html',
    './Exercises/exercises-conditionals.html',
    './Exercises/exercises-loops.html',
    './Exercises/exercises-functions.html',
    './Exercises/exercises-arrays.html',
    './Exercises/exercise-enhancements.js'
];

// Install event - cache core assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching core assets');
                return cache.addAll([...CORE_ASSETS, ...LESSON_PAGES, ...EXERCISE_PAGES]);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip external requests (like Google Fonts, CDNs)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .then(fetchResponse => {
                        // Don't cache if not a successful response
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }

                        // Clone the response
                        const responseToCache = fetchResponse.clone();

                        // Cache the fetched response
                        caches.open(RUNTIME_CACHE)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    });
            })
            .catch(() => {
                // Return offline page if available
                if (event.request.mode === 'navigate') {
                    return caches.match('./offline.html');
                }
            })
    );
});

// Message event - for cache updates
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            })
        );
    }
});

// Periodic background sync (if supported)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgress());
    }
});

async function syncProgress() {
    // Sync user progress to server if online
    // This is a placeholder for future server integration
    console.log('[Service Worker] Syncing progress...');
}

