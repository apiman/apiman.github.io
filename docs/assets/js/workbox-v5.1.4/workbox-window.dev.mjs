try{self["workbox:window:5.1.4"]&&_()}catch{}function messageSW(e,t){return new Promise(n=>{const s=new MessageChannel;s.port1.onmessage=e=>{n(e.data)},e.postMessage(t,[s.port2])})}try{self["workbox:core:5.1.4"]&&_()}catch{}class Deferred{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}function dontWaitFor(e){e.then(()=>{})}const logger=(()=>{"__WB_DISABLE_DEV_LOGS"in self||(self.__WB_DISABLE_DEV_LOGS=!1);let e=!1;const t={debug:`#7f8c8d`,log:`#2ecc71`,warn:`#f39c12`,error:`#c0392b`,groupCollapsed:`#3498db`,groupEnd:null},s=function(n,s){if(self.__WB_DISABLE_DEV_LOGS)return;if(n==="groupCollapsed"&&/^((?!chrome|android).)*safari/i.test(navigator.userAgent)){console[n](...s);return}const o=[`background: ${t[n]}`,`border-radius: 0.5em`,`color: white`,`font-weight: bold`,`padding: 2px 0.5em`],i=e?[]:["%cworkbox",o.join(";")];console[n](...i,...s),n==="groupCollapsed"&&(e=!0),n==="groupEnd"&&(e=!1)},n={},o=Object.keys(t);for(const t of o){const e=t;n[e]=(...t)=>{s(e,t)}}return n})();class WorkboxEventTarget{constructor(){this._eventListenerRegistry=new Map}addEventListener(e,t){const n=this._getEventListenersByType(e);n.add(t)}removeEventListener(e,t){this._getEventListenersByType(e).delete(t)}dispatchEvent(e){e.target=this;const t=this._getEventListenersByType(e.type);for(const n of t)n(e)}_getEventListenersByType(e){return this._eventListenerRegistry.has(e)||this._eventListenerRegistry.set(e,new Set),this._eventListenerRegistry.get(e)}}function urlsMatch(e,t){const{href:n}=location;return new URL(e,n).href===new URL(t,n).href}class WorkboxEvent{constructor(e,t){this.type=e,Object.assign(this,t)}}const WAITING_TIMEOUT_DURATION=200,REGISTRATION_TIMEOUT_DURATION=6e4;class Workbox extends WorkboxEventTarget{constructor(e,t={}){super(),this._registerOptions={},this._updateFoundCount=0,this._swDeferred=new Deferred,this._activeDeferred=new Deferred,this._controllingDeferred=new Deferred,this._registrationTime=0,this._ownSWs=new Set,this._onUpdateFound=()=>{const t=this._registration,e=t.installing,n=this._updateFoundCount>0||!urlsMatch(e.scriptURL,this._scriptURL)||performance.now()>this._registrationTime+REGISTRATION_TIMEOUT_DURATION;n?(this._externalSW=e,t.removeEventListener("updatefound",this._onUpdateFound)):(this._sw=e,this._ownSWs.add(e),this._swDeferred.resolve(e),navigator.serviceWorker.controller?logger.log("Updated service worker found. Installing now..."):logger.log("Service worker is installing...")),++this._updateFoundCount,e.addEventListener("statechange",this._onStateChange)},this._onStateChange=e=>{const a=this._registration,t=e.target,{state:s}=t,n=t===this._externalSW,i=n?"external":"",o={sw:t,originalEvent:e};switch(!n&&this._isUpdate&&(o.isUpdate=!0),this.dispatchEvent(new WorkboxEvent(i+s,o)),s==="installed"?this._waitingTimeout=self.setTimeout(()=>{s==="installed"&&a.waiting===t&&(this.dispatchEvent(new WorkboxEvent(i+"waiting",o)),n?logger.warn("An external service worker has installed but is waiting for this client to close before activating..."):logger.warn("The service worker has installed but is waiting for existing clients to close before activating..."))},WAITING_TIMEOUT_DURATION):s==="activating"&&(clearTimeout(this._waitingTimeout),n||this._activeDeferred.resolve(t)),s){case"installed":n?logger.warn("An external service worker has installed. You may want to suggest users reload this page."):logger.log("Registered service worker installed.");break;case"activated":n?logger.warn("An external service worker has activated."):(logger.log("Registered service worker activated."),t!==navigator.serviceWorker.controller&&logger.warn("The registered service worker is active but not yet controlling the page. Reload or run `clients.claim()` in the service worker."));break;case"redundant":t===this._compatibleControllingSW?logger.log("Previously controlling service worker now redundant!"):n||logger.log("Registered service worker now redundant!");break}},this._onControllerChange=e=>{const t=this._sw;t===navigator.serviceWorker.controller&&(this.dispatchEvent(new WorkboxEvent("controlling",{sw:t,originalEvent:e,isUpdate:this._isUpdate})),logger.log("Registered service worker now controlling this page."),this._controllingDeferred.resolve(t))},this._onMessage=async e=>{const{data:n,source:t}=e;await this.getSW(),this._ownSWs.has(t)&&this.dispatchEvent(new WorkboxEvent("message",{data:n,sw:t,originalEvent:e}))},this._scriptURL=e,this._registerOptions=t,navigator.serviceWorker.addEventListener("message",this._onMessage)}async register({immediate:e=!1}={}){if(this._registrationTime){logger.error("Cannot re-register a Workbox instance after it has been registered. Create a new instance instead.");return}!e&&document.readyState!=="complete"&&await new Promise(e=>window.addEventListener("load",e)),this._isUpdate=Boolean(navigator.serviceWorker.controller),this._compatibleControllingSW=this._getControllingSWIfCompatible(),this._registration=await this._registerScript(),this._compatibleControllingSW&&(this._sw=this._compatibleControllingSW,this._activeDeferred.resolve(this._compatibleControllingSW),this._controllingDeferred.resolve(this._compatibleControllingSW),this._compatibleControllingSW.addEventListener("statechange",this._onStateChange,{once:!0}));const t=this._registration.waiting;t&&urlsMatch(t.scriptURL,this._scriptURL)&&(this._sw=t,dontWaitFor(Promise.resolve().then(()=>{this.dispatchEvent(new WorkboxEvent("waiting",{sw:t,wasWaitingBeforeRegister:!0})),logger.warn("A service worker was already waiting to activate before this script was registered...")}))),this._sw&&(this._swDeferred.resolve(this._sw),this._ownSWs.add(this._sw));{logger.log("Successfully registered service worker.",this._scriptURL),navigator.serviceWorker.controller&&(this._compatibleControllingSW?logger.debug("A service worker with the same script URL is already controlling this page."):logger.debug("A service worker with a different script URL is currently controlling the page. The browser is now fetching the new script now..."));const e=()=>{const e=new URL(this._registerOptions.scope||this._scriptURL,document.baseURI),t=new URL("./",e.href).pathname;return!location.pathname.startsWith(t)};e()&&logger.warn("The current page is not in scope for the registered service worker. Was this a mistake?")}return this._registration.addEventListener("updatefound",this._onUpdateFound),navigator.serviceWorker.addEventListener("controllerchange",this._onControllerChange,{once:!0}),this._registration}async update(){if(!this._registration){logger.error("Cannot update a Workbox instance without being registered. Register the Workbox instance first.");return}await this._registration.update()}get active(){return this._activeDeferred.promise}get controlling(){return this._controllingDeferred.promise}async getSW(){return this._sw!==void 0?this._sw:this._swDeferred.promise}async messageSW(e){const t=await this.getSW();return messageSW(t,e)}_getControllingSWIfCompatible(){const e=navigator.serviceWorker.controller;return e&&urlsMatch(e.scriptURL,this._scriptURL)?e:void 0}async _registerScript(){try{const e=await navigator.serviceWorker.register(this._scriptURL,this._registerOptions);return this._registrationTime=performance.now(),e}catch(e){throw logger.error(e),e}}}export{Workbox,messageSW}