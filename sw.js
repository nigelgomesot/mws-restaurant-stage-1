const appName = 'restaurant-reviews';
const staticCacheName = appName + '-v1.0';
const contentImgCache = appName + '-images';

var allCaches = [
	staticCacheName,
	contentImgCache
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
			return cache.addAll([
				'/',
				'/restaurant.html',
				'/css/styles.css',
				'/css/styles-medium.css',
				'/js/dbhelper.js',
				'/js/secret.js',
				'/js/main.js',
				'/js/restaurant_info.js',
				'/js/register-sw.js',
				'data/restaurants.json'
			]);
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith(appName) &&
						   !allCaches.includes(cacheName);
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	const requestUrl = new URL(event.request.url);

	if (requestUrl.origin === location.origin) {
		const restaurant_path = '/restaurant.html';
		if (requestUrl.pathname.startsWith(restaurant_path)) {
			return event.respondWith(caches.match(restaurant_path));
		}
	}

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});
