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
