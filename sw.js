
// 獨立快取前綴，確保不與其他 App 衝突
const CACHE_PREFIX = 'golfpro-cache-';
const CACHE_VERSION = 'v13'; // 👈 關鍵修改：改成 v13，強制手機重新下載 manifest.json
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;

// ... 下面都不用動 ...

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 安裝階段：跳過等待，立即啟用
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 啟動階段：只清理「同前綴」但「不同版本」的舊快取，絕不誤刪其他 App 檔案
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 抓取階段：快取優先防呆邏輯
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 若快取有資料則回傳快取，否則透過網路抓取
        return response || fetch(event.request);
      })
  );
});
;
