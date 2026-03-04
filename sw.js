// 定義快取的名稱與要存下來的外殼檔案
const CACHE_NAME = 'golf-app-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 當手機「安裝」這個 App 時，管家會把外殼檔案偷偷下載到手機記憶體裡
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 每次打開 App 時，管家會攔截網路請求，如果手機裡有存過，就直接秒給手機
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // 命中快取，直接從手機載入（秒開）
        }
        return fetch(event.request); // 沒命中，才去跟網路要
      })
  );
});
