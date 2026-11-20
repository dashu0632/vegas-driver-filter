// Network-first HTML/JS ensures newly uploaded V10 updates replace older V7 service-worker cache.
const CACHE='vegas-filter-v10-static-1';
const LOCAL=['./','./index.html','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(LOCAL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=='GET')return;
if(e.request.mode==='navigate'||/\.(?:js|html|webmanifest)$/.test(u.pathname)){e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request)));return}
e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request)))});
