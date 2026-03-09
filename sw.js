// 每次你在 GitHub 改了 index.html 的內容，請記得把這裡的 v2 改成 v3, v4...
const CACHE_PREFIX = 'general-cache-';
const CACHE_VERSION = 'v2'; 
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 安裝時，把外殼檔案存到手機裡
self.addEventListener('install', event => {
  self.skipWaiting(); // 強制立刻接管
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 🌟 新增的大掃除機制：只要 CACHE_NAME 改變，就刪除舊的快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // 確保所有開啟的網頁立刻套用新版
});

// 攔截網路請求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // 從快取拿
        }
        return fetch(event.request); // 從網路拿
      })
  );
});
