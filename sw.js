// The codex read offline: every file the page fetches is kept as it comes, and served from
// the keep only when the network does not answer. Online, it is always the newest build.
const KEEP = 'codex-v1'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', e => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(KEEP).then(c => c.put(req, copy)) }
    return res
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('./'))))
})
