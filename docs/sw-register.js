"serviceWorker"in navigator&&navigator.serviceWorker.register("/service-worker.js?v=1724157331").then(function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){switch(t.state){case"installed":var e;navigator.serviceWorker.controller&&(e=new Event("sw.update"),window.dispatchEvent(e))}}}}).catch(function(e){console.error("Error during service worker registration:",e)})