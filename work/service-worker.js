//var cacheName = 'appShell';
var dataCacheName = 'appData';

// var filesToCache = [
// 					  '../work/',
// 					  '../work/index.html',
// 					  '../work/manifest.json',
// 					  '../work/scripts/app.js',
// 					  '../work/styles/inline.css',
// 					  '../work/images/clear.png',
// 					  '../work/images/cloudy-scattered-showers.png',
// 					  '../work/images/cloudy.png',
// 					  '../work/images/fog.png',
// 					  '../work/images/ic_add_white_24px.svg',
// 					  '../work/images/ic_refresh_white_24px.svg',
// 					  '../work/images/partly-cloudy.png',
// 					  '../work/images/rain.png',
// 					  '../work/images/scattered-showers.png',
// 					  '../work/images/sleet.png',
// 					  '../work/images/snow.png',
// 					  '../work/images/thunderstorm.png',
// 					  '../work/images/wind.png'
// 					];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  //e.waitUntil(
    // caches.open(cacheName).then(function(cache) {
    //   console.log('[ServiceWorker] Caching app shell');
    //   return cache.addAll(filesToCache);
    // })
  //);
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key == dataCacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
	  	console.log('[ServiceWorker] Fetch', e.request.url);
	    e.respondWith(

	      fetch(e.request)
	        .then(function(response) {
	       		if(!response || response.status !== 200) {
	       			return caches.match(e.request.url);
	       		}else{
	          		return caches.open(dataCacheName).then(function(cache) {
	            		cache.put(e.request.url, response.clone());
	            		console.log('[ServiceWorker] Fetched&Cached Data');
	            		return response;
	          		})
	          	} 
	        }).catch(function(error) {
				return caches.match(e.request.url);
			})
			
	    );
});