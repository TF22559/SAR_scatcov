// Cache hors ligne : on sert le cache, puis on met à jour en arrière-plan.
const V="imagette-v2";
const FILES=["./","index.html","b6.js","manifest.webmanifest","fonts/fonts.css",
"fonts/bricolage-grotesque-latin-500-normal.woff2","fonts/bricolage-grotesque-latin-700-normal.woff2",
"fonts/ibm-plex-sans-latin-400-normal.woff2","fonts/ibm-plex-sans-latin-500-normal.woff2","fonts/ibm-plex-sans-latin-600-normal.woff2",
"fonts/ibm-plex-mono-latin-400-normal.woff2","fonts/ibm-plex-mono-latin-500-normal.woff2",
"icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
    return hit||net;
  }));
});
