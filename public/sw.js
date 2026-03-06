const CACHE_PREFIX = 'netdisk-search'
const STATIC_CACHE_NAME = `${CACHE_PREFIX}-static-v2`
const APP_SHELL_URLS = ['/', '/manifest.json', '/icon.svg']
const STATIC_REQUEST_DESTINATIONS = new Set(['style', 'script', 'image', 'font'])

const isCacheableResponse = (response) => response && response.ok

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== STATIC_CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  )
})

const networkFirst = async (request) => {
  const cache = await caches.open(STATIC_CACHE_NAME)

  try {
    const response = await fetch(request)

    if (isCacheableResponse(response)) {
      cache.put(request, response.clone())
    }

    return response
  } catch {
    return (await cache.match(request)) || (await cache.match('/')) || Response.error()
  }
}

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(STATIC_CACHE_NAME)
  const cachedResponse = await cache.match(request)

  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (isCacheableResponse(response)) {
        cache.put(request, response.clone())
      }

      return response
    })
    .catch(() => null)

  if (cachedResponse) {
    return cachedResponse
  }

  return (await networkResponsePromise) || Response.error()
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(request.url)

  if (requestUrl.origin !== self.location.origin || requestUrl.pathname.startsWith('/api/')) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  if (STATIC_REQUEST_DESTINATIONS.has(request.destination) || requestUrl.pathname.startsWith('/assets/')) {
    event.respondWith(staleWhileRevalidate(request))
  }
})
