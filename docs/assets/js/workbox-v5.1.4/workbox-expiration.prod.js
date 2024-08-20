this.workbox=this.workbox||{},this.workbox.expiration=function(e,t,n,s,o,i,a){"use strict";try{self["workbox:expiration:5.1.4"]&&_()}catch{}const r=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class l{constructor(e){this.t=e,this.s=new s.DBWrapper("workbox-expiration",1,{onupgradeneeded:e=>this.i(e)})}i(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),o.deleteDatabase(this.t)}async setTimestamp(e,t){const n={url:e=r(e),timestamp:t,cacheName:this.t,id:this.h(e)};await this.s.put("cache-entries",n)}async getTimestamp(e){return(await this.s.get("cache-entries",this.h(e))).timestamp}async expireEntries(e,t){const s=await this.s.transaction("cache-entries","readwrite",(n,s)=>{const o=n.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),i=[];let a=0;o.onsuccess=()=>{const n=o.result;if(n){const s=n.value;s.cacheName===this.t&&(e&&s.timestamp<e||t&&a>=t?i.push(n.value):a++),n.continue()}else s(i)}}),n=[];for(const e of s)await this.s.delete("cache-entries",e.id),n.push(e.url);return n}h(e){return this.t+"|"+r(e)}}class c{constructor(e,t={}){this.o=!1,this.u=!1,this.l=t.maxEntries,this.m=t.maxAgeSeconds,this.t=e,this.p=new l(e)}async expireEntries(){if(this.o)return void(this.u=!0);this.o=!0;const e=this.m?Date.now()-1e3*this.m:0,n=await this.p.expireEntries(e,this.l),s=await self.caches.open(this.t);for(const e of n)await s.delete(e);this.o=!1,this.u&&(this.u=!1,t.dontWaitFor(this.expireEntries()))}async updateTimestamp(e){await this.p.setTimestamp(e,Date.now())}async isURLExpired(e){return!!this.m&&await this.p.getTimestamp(e)<Date.now()-1e3*this.m}async delete(){this.u=!1,await this.p.expireEntries(1/0)}}return e.CacheExpiration=c,e.ExpirationPlugin=class{constructor(e={}){this.cachedResponseWillBeUsed=async({event:e,request:n,cacheName:s,cachedResponse:o})=>{if(!o)return null;const a=this.k(o),i=this.D(s);t.dontWaitFor(i.expireEntries());const r=i.updateTimestamp(n.url);if(e)try{e.waitUntil(r)}catch{}return a?o:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const n=this.D(e);await n.updateTimestamp(t.url),await n.expireEntries()},this.N=e,this.m=e.maxAgeSeconds,this.g=new Map,e.purgeOnQuotaError&&a.registerQuotaErrorCallback(()=>this.deleteCacheAndMetadata())}D(e){if(e===i.cacheNames.getRuntimeName())throw new n.WorkboxError("expire-custom-caches-only");let t=this.g.get(e);return t||(t=new c(e,this.N),this.g.set(e,t)),t}k(e){if(!this.m)return!0;const t=this._(e);return null===t||t>=Date.now()-1e3*this.m}_(e){if(!e.headers.has("date"))return null;const n=e.headers.get("date"),t=new Date(n).getTime();return isNaN(t)?null:t}async deleteCacheAndMetadata(){for(const[e,t]of this.g)await self.caches.delete(e),await t.delete();this.g=new Map}},e}({},workbox.core._private,workbox.core._private,workbox.core._private,workbox.core._private,workbox.core._private,workbox.core)