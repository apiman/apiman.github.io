this.workbox=this.workbox||{},this.workbox.googleAnalytics=function(e,t,n,s,o,i,a,r,c){"use strict";try{self["workbox:google-analytics:5.1.4"]&&_()}catch{}const p="workbox-google-analytics",h=60*48,l="www.google-analytics.com",d="www.googletagmanager.com",m="/analytics.js",f="/gtag/js",u="/gtm.js",g=/^\/(\w+\/)?collect/,v=e=>async({queue:t})=>{let n;for(;n=await t.shiftRequest();){const{request:a,timestamp:r}=n,i=new URL(a.url);try{const t=a.method==="POST"?new URLSearchParams(await a.clone().text()):i.searchParams,n=r-(Number(t.get("qt"))||0),c=Date.now()-n;if(t.set("qt",String(c)),e.parameterOverrides)for(const n of Object.keys(e.parameterOverrides)){const s=e.parameterOverrides[n];t.set(n,s)}typeof e.hitFilter=="function"&&e.hitFilter.call(null,t),await fetch(new Request(i.origin+i.pathname,{body:t.toString(),method:"POST",mode:"cors",credentials:"omit",headers:{"Content-Type":"text/plain"}})),"dev"!=="production"&&o.logger.log(`Request for '${s.getFriendlyURL(i.href)}'`+`has been replayed`)}catch(e){throw await t.unshiftRequest(n),o.logger.log(`Request for '${s.getFriendlyURL(i.href)}'`+`failed to replay, putting it back in the queue.`),e}}o.logger.log(`All Google Analytics request successfully replayed; `+`the queue is now empty!`)},b=e=>{const t=({url:e})=>e.hostname===l&&g.test(e.pathname),n=new c.NetworkOnly({plugins:[e]});return[new i.Route(t,n,"GET"),new i.Route(t,n,"POST")]},j=e=>{const t=({url:e})=>e.hostname===l&&e.pathname===m,n=new r.NetworkFirst({cacheName:e});return new i.Route(t,n,"GET")},y=e=>{const t=({url:e})=>e.hostname===d&&e.pathname===f,n=new r.NetworkFirst({cacheName:e});return new i.Route(t,n,"GET")},w=e=>{const t=({url:e})=>e.hostname===d&&e.pathname===u,n=new r.NetworkFirst({cacheName:e});return new i.Route(t,n,"GET")},O=(e={})=>{const s=n.cacheNames.getGoogleAnalyticsName(e.cacheName),i=new t.BackgroundSyncPlugin(p,{maxRetentionTime:h,onSync:v(e)}),r=[w(s),j(s),y(s),...b(i)],o=new a.Router;for(const e of r)o.registerRoute(e);o.addFetchListener()};return e.initialize=O,e}({},workbox.backgroundSync,workbox.core._private,workbox.core._private,workbox.core._private,workbox.routing,workbox.routing,workbox.strategies,workbox.strategies)