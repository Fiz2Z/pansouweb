const CACHE_NAME = 'netdisk-search-v1';
const urlsToCache = [
  '/',
  '/static/js/',
  '/static/css/',
  '/manifest.json'
];

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 请求拦截
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有，直接返回
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
