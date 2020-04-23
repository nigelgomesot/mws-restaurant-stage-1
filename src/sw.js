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
				'/js/main.js',
				'/js/restaurant_info.js'
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

		if (requestUrl.pathname.startsWith('/img')) {
			return event.respondWith(serveImage(event.request));
		}
	}

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});

function serveImage(request) {
	let imageStoreUrl = request.url;

	imageStoreUrl = imageStoreUrl.replace(/-small\.\w{3,4}|-medium\.\w{3,4}|-large\.\w{3,4}/i,'');

	return caches.open(contentImgCache).then(function(cache) {
		return cache.match(imageStoreUrl).then(function(cacheResponse) {
			return cacheResponse || fetch(request).then(function(networkResponse) {
				cache.put(imageStoreUrl, networkResponse.clone());

				return networkResponse;
			});
		});
	});
}

self.addEventListener('sync', function(event) {
	if (event.tag === 'syncOfflineFavorites') {
		event.waitUntil(syncOfflineFavorites());
	}
});

function syncOfflineFavorites() {
	console.log('syncOfflineFavorites started');
}
