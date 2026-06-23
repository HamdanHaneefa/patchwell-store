// Shiprocket SDK requires a service worker to be declared in the manifest.
// We provide this empty file so the browser doesn't throw a 404 error when trying to fetch it.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
