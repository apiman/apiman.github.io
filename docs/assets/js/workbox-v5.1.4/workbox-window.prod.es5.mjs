try{self["workbox:window:5.1.4"]&&_()}catch{}function n(e,t){return new Promise(function(n){var s=new MessageChannel;s.port1.onmessage=function(e){n(e.data)},e.postMessage(t,[s.port2])})}function t(e,t){for(var n,s=0;s<t.length;s++)n=t[s],n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}function r(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,s=new Array(t);n<t;n++)s[n]=e[n];return s}function e(e,t){if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var n,s=0;return function(){return s>=e.length?{done:!0}:{done:!1,value:e[s++]}}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}return(n=e[Symbol.iterator]()).next.bind(n)}try{self["workbox:core:5.1.4"]&&_()}catch{}var u,f,i=function(){var e=this;this.promise=new Promise(function(t,n){e.resolve=t,e.reject=n})};function o(e,t){var n=location.href;return new URL(e,n).href===new URL(t,n).href}u=function(e,t){this.type=e,Object.assign(this,t)};function a(e,t,n){return n?t?t(e):e:(e&&e.then||(e=Promise.resolve(e)),t?e.then(t):e)}function c(){}f=function(e){function l(t,n){var s,r;return void 0===n&&(n={}),(s=e.call(this)||this).t={},s.i=0,s.o=new i,s.u=new i,s.s=new i,s.v=0,s.h=new Set,s.l=function(){var t=s.m,e=t.installing;s.i>0||!o(e.scriptURL,s.g)||performance.now()>s.v+6e4?(s.p=e,t.removeEventListener("updatefound",s.l)):(s.P=e,s.h.add(e),s.o.resolve(e)),++s.i,e.addEventListener("statechange",s.S)},s.S=function(e){var r=s.m,t=e.target,n=t.state,o=t===s.p,a=o?"external":"",i={sw:t,originalEvent:e};!o&&s.j&&(i.isUpdate=!0),s.dispatchEvent(new u(a+n,i)),"installed"===n?s.A=self.setTimeout(function(){"installed"===n&&r.waiting===t&&s.dispatchEvent(new u(a+"waiting",i))},200):"activating"===n&&(clearTimeout(s.A),o||s.u.resolve(t))},s.O=function(e){var t=s.P;t===navigator.serviceWorker.controller&&(s.dispatchEvent(new u("controlling",{sw:t,originalEvent:e,isUpdate:s.j})),s.s.resolve(t))},s.U=(r=function(e){var n=e.data,t=e.source;return a(s.getSW(),function(){s.h.has(t)&&s.dispatchEvent(new u("message",{data:n,sw:t,originalEvent:e}))})},function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];try{return Promise.resolve(r.apply(this,t))}catch(e){return Promise.reject(e)}}),s.g=t,s.t=n,navigator.serviceWorker.addEventListener("message",s.U),s}d=e,(c=l).prototype=Object.create(d.prototype),c.prototype.constructor=c,c.__proto__=d;var c,d,h,m,f,r=l.prototype;return r.register=function(e){var t,n=(void 0===e?{}:e).immediate,i=void 0!==n&&n;try{return t=this,function(e,t){var n=e();return n&&n.then?n.then(t):t(n)}(function(){if(!i&&"complete"!==document.readyState)return s(new Promise(function(e){return window.addEventListener("load",e)}))},function(){return t.j=Boolean(navigator.serviceWorker.controller),t.I=t.M(),a(t.R(),function(e){t.m=e,t.I&&(t.P=t.I,t.u.resolve(t.I),t.s.resolve(t.I),t.I.addEventListener("statechange",t.S,{once:!0}));var n=t.m.waiting;return n&&o(n.scriptURL,t.g)&&(t.P=n,Promise.resolve().then(function(){t.dispatchEvent(new u("waiting",{sw:n,wasWaitingBeforeRegister:!0}))}).then(function(){})),t.P&&(t.o.resolve(t.P),t.h.add(t.P)),t.m.addEventListener("updatefound",t.l),navigator.serviceWorker.addEventListener("controllerchange",t.O,{once:!0}),t.m})})}catch(e){return Promise.reject(e)}},r.update=function(){try{return this.m?s(this.m.update()):void 0}catch(e){return Promise.reject(e)}},r.getSW=function(){try{return void 0!==this.P?this.P:this.o.promise}catch(e){return Promise.reject(e)}},r.messageSW=function(e){try{return a(this.getSW(),function(t){return n(t,e)})}catch(e){return Promise.reject(e)}},r.M=function(){var e=navigator.serviceWorker.controller;return e&&o(e.scriptURL,this.g)?e:void 0},r.R=function(){try{var e=this;return function(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}(function(){return a(navigator.serviceWorker.register(e.g,e.t),function(t){return e.v=performance.now(),t})},function(e){throw e})}catch(e){return Promise.reject(e)}},h=l,(m=[{key:"active",get:function(){return this.u.promise}},{key:"controlling",get:function(){return this.s.promise}}])&&t(h.prototype,m),f&&t(h,f),l}(function(){function n(){this.k=new Map}var t=n.prototype;return t.addEventListener=function(e,t){this.B(e).add(t)},t.removeEventListener=function(e,t){this.B(e).delete(t)},t.dispatchEvent=function(t){t.target=this;for(var n,s=e(this.B(t.type));!(n=s()).done;)(0,n.value)(t)},t.B=function(e){return this.k.has(e)||this.k.set(e,new Set),this.k.get(e)},n}());function s(e,t){if(!t)return e&&e.then?e.then(c):Promise.resolve()}export{f as Workbox,n as messageSW}