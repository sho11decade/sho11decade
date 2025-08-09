// Service Worker for Portfolio Site
const CACHE_NAME = 'portfolio-v1.2';
const STATIC_CACHE = 'static-v1.2';
const DYNAMIC_CACHE = 'dynamic-v1.2';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/images/og-image.jpg',
    '/images/qiita-icon.png',
    '/images/favicons/favicon.ico',
    '/images/favicons/icon-192x192.png',
    '/images/favicons/icon-512x512.png'
];

// Critical assets that should be cached first
const CRITICAL_ASSETS = [
    '/style.css',
    '/script.js',
    '/images/og-image.jpg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker');
    event.waitUntil(
        Promise.all([
            // Cache critical assets first
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[SW] Caching critical assets');
                return cache.addAll(CRITICAL_ASSETS);
            }),
            // Then cache other static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
        ]).then(() => {
            console.log('[SW] Installation complete');
            return self.skipWaiting();
        }).catch(error => {
            console.error('[SW] Installation failed:', error);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Google Analytics and external APIs
    if (url.hostname.includes('google-analytics.com') || 
        url.hostname.includes('googletagmanager.com')) {
        return;
    }

    // Handle different types of requests
    if (isStaticAsset(request.url)) {
        // Static assets: Cache First strategy
        event.respondWith(cacheFirstStrategy(request));
    } else if (isImageRequest(request)) {
        // Images: Cache First with fallback
        event.respondWith(imageStrategy(request));
    } else if (isFontRequest(request)) {
        // Fonts: Cache First
        event.respondWith(fontStrategy(request));
    } else if (isHTMLRequest(request)) {
        // HTML: Network First with cache fallback
        event.respondWith(networkFirstStrategy(request));
    } else {
        // Other requests: Network First
        event.respondWith(networkFirstStrategy(request));
    }
});

// Cache First Strategy (for static assets)
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache First failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

// Network First Strategy (for HTML and dynamic content)
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Offline', { status: 503 });
    }
}

// Image Strategy
async function imageStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('[SW] Image strategy failed:', error);
        // Return a placeholder or fallback image if needed
        return new Response('', { status: 503 });
    }
}

// Font Strategy
async function fontStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request, {
            mode: 'cors',
            credentials: 'omit'
        });
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('[SW] Font strategy failed:', error);
        return new Response('', { status: 503 });
    }
}

// Helper functions
function isStaticAsset(url) {
    return url.includes('.css') || 
           url.includes('.js') || 
           url.includes('/favicons/');
}

function isImageRequest(request) {
    return request.destination === 'image' || 
           request.url.includes('.jpg') || 
           request.url.includes('.png') || 
           request.url.includes('.svg') ||
           request.url.includes('.webp');
}

function isFontRequest(request) {
    return request.destination === 'font' ||
           request.url.includes('fonts.googleapis.com') ||
           request.url.includes('fonts.gstatic.com') ||
           request.url.includes('.woff') ||
           request.url.includes('.woff2');
}

function isHTMLRequest(request) {
    return request.destination === 'document' ||
           request.headers.get('accept').includes('text/html');
}

// Background sync for failed requests (if supported)
self.addEventListener('sync', event => {
    console.log('[SW] Background sync triggered:', event.tag);
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Implement background sync logic if needed
    console.log('[SW] Performing background sync');
}
