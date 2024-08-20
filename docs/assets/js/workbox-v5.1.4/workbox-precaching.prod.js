this.workbox=this.workbox||{},this.workbox.precaching=function(e,t,n,s,o,i){"use strict";try{self["workbox:precaching:5.1.4"]&&_()}catch{}const c=[],l={get:()=>c,add(e){c.push(...e)}};function f(e){if(!e)throw new o.WorkboxError("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:n,url:t}=e;if(!t)throw new o.WorkboxError("add-to-cache-list-unexpected-type",{entry:e});if(!n){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const s=new URL(t,location.href),i=new URL(t,location.href);return s.searchParams.set("__WB_REVISION__",n),{cacheKey:s.href,url:i.href}}class d{constructor(e){this.t=t.cacheNames.getPrecacheName(e),this.i=new Map,this.s=new Map,this.o=new Map}addToCacheList(e){const t=[];for(const n of e){"string"==typeof n?t.push(n):n&&void 0===n.revision&&t.push(n.url);const{cacheKey:s,url:i}=f(n),a="string"!=typeof n&&n.revision?"reload":"default";if(this.i.has(i)&&this.i.get(i)!==s)throw new o.WorkboxError("add-to-cache-list-conflicting-entries",{firstEntry:this.i.get(i),secondEntry:s});if("string"!=typeof n&&n.integrity){if(this.o.has(s)&&this.o.get(s)!==n.integrity)throw new o.WorkboxError("add-to-cache-list-conflicting-integrities",{url:i});this.o.set(s,n.integrity)}if(this.i.set(i,s),this.s.set(i,a),t.length>0){const e=`Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const n=[],s=[],o=await self.caches.open(this.t),i=await o.keys(),a=new Set(i.map(e=>e.url));for(const[e,t]of this.i)a.has(t)?s.push(e):n.push({cacheKey:t,url:e});const r=n.map(({cacheKey:n,url:s})=>{const o=this.o.get(n),i=this.s.get(s);return this.h({cacheKey:n,cacheMode:i,event:e,integrity:o,plugins:t,url:s})});return await Promise.all(r),{updatedURLs:n.map(e=>e.url),notUpdatedURLs:s}}async activate(){const e=await self.caches.open(this.t),n=await e.keys(),s=new Set(this.i.values()),t=[];for(const o of n)s.has(o.url)||(await e.delete(o),t.push(o.url));return{deletedURLs:t}}async h({cacheKey:e,url:t,cacheMode:a,event:r,plugins:c,integrity:l}){const u=new Request(t,{integrity:l,cache:a,credentials:"same-origin"});let h,d=await s.fetchWrapper.fetch({event:r,plugins:c,request:u});for(const e of c||[])"cacheWillUpdate"in e&&(h=e);if(!(h?await h.cacheWillUpdate({event:r,request:u,response:d}):d.status<400))throw new o.WorkboxError("bad-precaching-response",{url:t,status:d.status});d.redirected&&(d=await i.copyResponse(d)),await n.cacheWrapper.put({event:r,plugins:c,response:d,request:e===t?u:new Request(e),cacheName:this.t,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.i}getCachedURLs(){return[...this.i.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.i.get(t.href)}async matchPrecache(e){const n=e instanceof Request?e.url:e,t=this.getCacheKeyForURL(n);if(t)return(await self.caches.open(this.t)).match(t)}createHandler(e=!0){return async({request:t})=>{try{const e=await this.matchPrecache(t);if(e)return e;throw new o.WorkboxError("missing-precache-entry",{cacheName:this.t,url:t instanceof Request?t.url:t})}catch(n){if(e)return fetch(t);throw n}}}createHandlerBoundToURL(e,t=!0){if(!this.getCacheKeyForURL(e))throw new o.WorkboxError("non-precached-url",{url:e});const n=this.createHandler(t),s=new Request(e);return()=>n({request:s})}}let r;const a=()=>(r||(r=new d),r),p=(e,t)=>{const n=a().getURLsToCacheKeys();for(const o of function*(e,{ignoreURLParametersMatching:t,directoryIndex:n,cleanURLs:s,urlManipulation:o}={}){const i=new URL(e,location.href);i.hash="",yield i.href;const a=function(e,t=[]){for(const n of[...e.searchParams.keys()])t.some(e=>e.test(n))&&e.searchParams.delete(n);return e}(i,t);if(yield a.href,n&&a.pathname.endsWith("/")){const e=new URL(a.href);e.pathname+=n,yield e.href}if(s){const e=new URL(a.href);e.pathname+=".html",yield e.href}if(o){const e=o({url:i});for(const t of e)yield t.href}}(e,t)){const s=n.get(o);if(s)return s}};let u=!1;function h(e){u||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:n="index.html",cleanURLs:s=!0,urlManipulation:o}={})=>{const i=t.cacheNames.getPrecacheName();self.addEventListener("fetch",t=>{const a=p(t.request.url,{cleanURLs:s,directoryIndex:n,ignoreURLParametersMatching:e,urlManipulation:o});if(!a)return;let r=self.caches.open(i).then(e=>e.match(a)).then(e=>e||fetch(a));t.respondWith(r)})})(e),u=!0)}const g=e=>{const t=a(),n=l.get();e.waitUntil(t.install({event:e,plugins:n}).catch(e=>{throw e}))},v=e=>{const t=a();e.waitUntil(t.activate())};function m(e){a().addToCacheList(e),e.length>0&&(self.addEventListener("install",g),self.addEventListener("activate",v))}return e.PrecacheController=d,e.addPlugins=function(e){l.add(e)},e.addRoute=h,e.cleanupOutdatedCaches=function(){self.addEventListener("activate",e=>{const n=t.cacheNames.getPrecacheName();e.waitUntil((async(e,t="-precache-")=>{const n=(await self.caches.keys()).filter(n=>n.includes(t)&&n.includes(self.registration.scope)&&n!==e);return await Promise.all(n.map(e=>self.caches.delete(e))),n})(n).then(e=>{}))})},e.createHandler=function(e=!0){return a().createHandler(e)},e.createHandlerBoundToURL=function(e){return a().createHandlerBoundToURL(e)},e.getCacheKeyForURL=function(e){return a().getCacheKeyForURL(e)},e.matchPrecache=function(e){return a().matchPrecache(e)},e.precache=m,e.precacheAndRoute=function(e,t){m(e),h(t)},e}({},workbox.core._private,workbox.core._private,workbox.core._private,workbox.core._private,workbox.core)