this.workbox=this.workbox||{},this.workbox.streams=function(e,t,n,s,o){"use strict";try{self["workbox:streams:5.1.4"]&&_()}catch{}function l(e){return e instanceof Response?e.body.getReader():e instanceof ReadableStream?e.getReader():new Response(e).body.getReader()}function i(e){n.assert.isArray(e,{moduleName:"workbox-streams",funcName:"concatenate",paramName:"sourcePromises"});const a=e.map(e=>Promise.resolve(e).then(e=>l(e))),o=new s.Deferred;let i=0;const r=[],c=new ReadableStream({pull(n){return a[i].then(e=>e.read()).then(s=>{if(s.done){if(r.push(["Reached the end of source:",e[i]]),i++,i>=a.length){{t.logger.groupCollapsed(`Concatenating ${a.length} sources.`);for(const e of r)Array.isArray(e)?t.logger.log(...e):t.logger.log(e);t.logger.log("Finished reading all sources."),t.logger.groupEnd()}n.close(),o.resolve();return}return this.pull(n)}n.enqueue(s.value)}).catch(e=>{throw t.logger.error("An error occurred:",e),o.reject(e),e})},cancel(){t.logger.warn("The ReadableStream was cancelled."),o.resolve()}});return{done:o.promise,stream:c}}function a(e={}){const t=new Headers(e);return t.has("content-type")||t.set("content-type","text/html"),t}function r(e,t){const{done:n,stream:s}=i(e),o=a(t),r=new Response(s,{headers:o});return{done:n,response:r}}function c(){return o.canConstructReadableStream()}function d(e,n){return async({event:s,request:o,url:i,params:l})=>{const d=e.map(e=>Promise.resolve(e({event:s,request:o,url:i,params:l})));if(c()){const{done:e,response:t}=r(d,n);return s&&s.waitUntil(e),t}t.logger.log(`The current browser doesn't support creating response `+`streams. Falling back to non-streaming response instead.`);const u=d.map(async e=>{const t=await e;return t instanceof Response?t.blob():new Response(t).blob()}),h=await Promise.all(u),m=a(n);return new Response(new Blob(h),{headers:m})}}return e.concatenate=i,e.concatenateToResponse=r,e.isSupported=c,e.strategy=d,e}({},workbox.core._private,workbox.core._private,workbox.core._private,workbox.core._private)