this.workbox=this.workbox||{},this.workbox.cacheableResponse=function(e){"use strict";try{self["workbox:cacheable-response:5.1.4"]&&_()}catch{}class t{constructor(e={}){this.s=e.statuses,this.t=e.headers}isResponseCacheable(e){let t=!0;return this.s&&(t=this.s.includes(e.status)),this.t&&t&&(t=Object.keys(this.t).some(t=>e.headers.get(t)===this.t[t])),t}}return e.CacheableResponse=t,e.CacheableResponsePlugin=class{constructor(e){this.cacheWillUpdate=async({response:e})=>this.i.isResponseCacheable(e)?e:null,this.i=new t(e)}},e}({})