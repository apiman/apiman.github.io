this.workbox=this.workbox||{},this.workbox.navigationPreload=function(e,t){"use strict";try{self["workbox:navigation-preload:5.1.4"]&&_()}catch{}function n(){return Boolean(self.registration&&self.registration.navigationPreload)}function s(){n()?self.addEventListener("activate",e=>{e.waitUntil(self.registration.navigationPreload.disable().then(()=>{t.logger.log(`Navigation preload is disabled.`)}))}):t.logger.log(`Navigation preload is not supported in this browser.`)}function o(e){n()?self.addEventListener("activate",n=>{n.waitUntil(self.registration.navigationPreload.enable().then(()=>{e&&self.registration.navigationPreload.setHeaderValue(e),t.logger.log(`Navigation preload is enabled.`)}))}):t.logger.log(`Navigation preload is not supported in this browser.`)}return e.disable=s,e.enable=o,e.isSupported=n,e}({},workbox.core._private)