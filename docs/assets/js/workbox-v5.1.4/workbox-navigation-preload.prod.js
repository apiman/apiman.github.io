this.workbox=this.workbox||{},this.workbox.navigationPreload=function(e){"use strict";try{self["workbox:navigation-preload:5.1.4"]&&_()}catch{}function t(){return Boolean(self.registration&&self.registration.navigationPreload)}return e.disable=function(){t()&&self.addEventListener("activate",e=>{e.waitUntil(self.registration.navigationPreload.disable().then(()=>{}))})},e.enable=function(e){t()&&self.addEventListener("activate",t=>{t.waitUntil(self.registration.navigationPreload.enable().then(()=>{e&&self.registration.navigationPreload.setHeaderValue(e)}))})},e.isSupported=t,e}({})