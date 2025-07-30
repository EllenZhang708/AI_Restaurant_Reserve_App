// MapleTable Service Worker
// Enhanced offline support for Canadian restaurant discovery

const CACHE_NAME = 'mapletable-v1.2.0';
const STATIC_CACHE = 'mapletable-static-v1.2.0';
const DYNAMIC_CACHE = 'mapletable-dynamic-v1.2.0';
const IMAGES_CACHE = 'mapletable-images-v1.2.0';

const urlsToCache = [
  '/',
  '/index.html',
  '/booking.html',
  '/reservations.html',
  '/customer-login.html',
  '/customer-register.html',
  '/merchant-login.html',
  '/merchant-register.html',
  '/merchant-dashboard.html',
  '/styles.css',
  '/toolbar-styles.css',
  '/login-styles.css',
  '/button-fix.css',
  '/app.js',
  '/booking.js',
  '/reservations.js',
  '/login.js',
  '/merchant-dashboard.js',
  '/booking.css',
  '/reservations.css',
  '/merchant-dashboard.css',
  '/ai-table-allocation.js',
  '/api-service.js',
  '/websocket-service.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/brands.min.css'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('🍁 MapleTable Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('🍁 MapleTable Service Worker: Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('🍁 MapleTable Service Worker: Installation complete');
        self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('🍁 MapleTable Service Worker: Installation failed:', error);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('🍁 MapleTable Service Worker: Activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGES_CACHE) {
              console.log('🍁 MapleTable Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
    .then(() => {
      console.log('🍁 MapleTable Service Worker: Activation complete');
    })
  );
});

// Enhanced fetch handling with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests with appropriate caching strategies
  if (request.method !== 'GET') {
    return; // Don't cache non-GET requests
  }
  
  // Handle restaurant images with cache-first strategy
  if (request.url.includes('images.unsplash.com') || 
      request.url.includes('unsplash.com') ||
      request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
    return;
  }
  
  // Handle API requests with network-first strategy
  if (request.url.includes('/api/') || 
      request.url.includes('localhost:3001')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }
  
  // Handle static assets with cache-first strategy
  if (urlsToCache.some(asset => request.url.includes(asset.replace('/', '')))) {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // Handle navigation requests with network-first, fallback to cache
  if (request.destination === 'document') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Default: try network first, fallback to cache
  event.respondWith(handleDefaultRequest(request));
});

// Cache-first strategy for images
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGES_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('🍁 MapleTable Service Worker: Image request failed:', error);
    // Return a placeholder image for restaurant images
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="400" height="300" fill="#f8f9fa"/>' +
      '<text x="200" y="150" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="14">🍁 MapleTable</text>' +
      '</svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Network-first strategy for API requests
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🍁 MapleTable Service Worker: API request failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This feature is not available offline',
        restaurants: [], // Empty array for restaurant requests
        bookings: []     // Empty array for booking requests
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache-first strategy for static assets
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('🍁 MapleTable Service Worker: Static request failed:', error);
    throw error;
  }
}

// Network-first strategy for navigation
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful navigation responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🍁 MapleTable Service Worker: Navigation request failed, serving cached version:', error);
    
    // Try to serve cached version of the specific page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to index.html for SPA routing
    const indexResponse = await caches.match('/index.html');
    if (indexResponse) {
      return indexResponse;
    }
    
    // Final fallback - offline page
    return new Response(
      createOfflinePage(),
      { 
        headers: { 'Content-Type': 'text/html' },
        status: 503,
        statusText: 'Service Unavailable'
      }
    );
  }
}

// Default network-first strategy
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Create offline page HTML
function createOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MapleTable - Offline</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #FF0000, #FFD700);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
            }
            .offline-container {
                background: rgba(255, 255, 255, 0.95);
                color: #333;
                padding: 3rem;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                max-width: 500px;
                margin: 2rem;
            }
            .offline-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .offline-title {
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #FF0000;
            }
            .offline-message {
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
                color: #666;
            }
            .retry-btn {
                background: #FF0000;
                color: white;
                border: none;
                padding: 1rem 2rem;
                font-size: 1.1rem;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
            }
            .retry-btn:hover {
                background: #dc3545;
                transform: translateY(-2px);
            }
            .features-list {
                text-align: left;
                margin: 1.5rem 0;
                padding: 0;
                list-style: none;
            }
            .features-list li {
                padding: 0.5rem 0;
                color: #666;
            }
            .features-list li::before {
                content: '🍁';
                margin-right: 0.5rem;
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">🍁</div>
            <h1 class="offline-title">You're Offline</h1>
            <p class="offline-message">
                Don't worry! Some MapleTable features are still available offline:
            </p>
            <ul class="features-list">
                <li>View your saved reservations</li>
                <li>Browse cached restaurant information</li>
                <li>Access your favorites</li>
                <li>View the icon generator</li>
            </ul>
            <p class="offline-message">
                Connect to the internet to discover new restaurants and make reservations.
            </p>
            <button class="retry-btn" onclick="window.location.reload()">
                Try Again
            </button>
        </div>
    </body>
    </html>
  `;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🍁 MapleTable Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-booking-sync') {
    event.waitUntil(syncOfflineBookings());
  }
  
  if (event.tag === 'background-data-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline bookings when connection is restored
async function syncOfflineBookings() {
  try {
    const offlineBookings = await getOfflineBookings();
    
    for (const booking of offlineBookings) {
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(booking)
        });
        
        if (response.ok) {
          await removeOfflineBooking(booking.id);
          console.log('🍁 MapleTable Service Worker: Synced offline booking:', booking.id);
        }
      } catch (error) {
        console.error('🍁 MapleTable Service Worker: Failed to sync booking:', booking.id, error);
      }
    }
  } catch (error) {
    console.error('🍁 MapleTable Service Worker: Background booking sync failed:', error);
  }
}

// Sync offline data
async function syncOfflineData() {
  try {
    // Update restaurant data
    await fetch('/api/restaurants');
    console.log('🍁 MapleTable Service Worker: Restaurant data synced');
    
    // Update user reservations
    await fetch('/api/user/reservations');
    console.log('🍁 MapleTable Service Worker: User reservations synced');
  } catch (error) {
    console.error('🍁 MapleTable Service Worker: Background data sync failed:', error);
  }
}

// Helper functions for offline data management
async function getOfflineBookings() {
  return JSON.parse(localStorage.getItem('mapleTableOfflineBookings') || '[]');
}

async function removeOfflineBooking(bookingId) {
  const offlineBookings = await getOfflineBookings();
  const filteredBookings = offlineBookings.filter(booking => booking.id !== bookingId);
  localStorage.setItem('mapleTableOfflineBookings', JSON.stringify(filteredBookings));
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('🍁 MapleTable Service Worker: Push notification received');
  
  const options = {
    body: 'You have a new reservation update!',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Reservations',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('MapleTable', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🍁 MapleTable Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/reservations.html')
    );
  }
});

// Periodic background sync for data updates
self.addEventListener('periodicsync', (event) => {
  console.log('🍁 MapleTable Service Worker: Periodic sync triggered:', event.tag);
  
  if (event.tag === 'update-restaurant-data') {
    event.waitUntil(updateRestaurantData());
  }
});

async function updateRestaurantData() {
  try {
    const response = await fetch('/api/restaurants');
    if (response.ok) {
      const restaurants = await response.json();
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put('/api/restaurants', new Response(JSON.stringify(restaurants)));
      console.log('🍁 MapleTable Service Worker: Restaurant data updated');
    }
  } catch (error) {
    console.error('🍁 MapleTable Service Worker: Failed to update restaurant data:', error);
  }
}

// Handle app update notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🍁 MapleTable Service Worker: Skipping waiting...');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME
    });
  }
});

console.log('🍁 MapleTable Service Worker: Loaded successfully');