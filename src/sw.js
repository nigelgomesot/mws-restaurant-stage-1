import { openDB } from 'idb';

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
	switch(event.tag) {
		case 'syncOfflineFavorites':
			event.waitUntil(syncOfflineFavorites());
			break;
		case 'syncOfflineReviews':
			event.waitUntil(syncOfflineReviews());
			break;
	}

});

function syncOfflineFavorites() {
	console.log('syncOfflineFavorites started');

	// read from offline favorties db
	// put request to server

	return openDB('restaurant-reviews').then(db => {
		console.log('get offlineFavorites from idb');

		const offlineFavoritesTxn = db.transaction('offline-favorites').objectStore('offline-favorites');

		offlineFavoritesTxn.getAll().then(offlineFavorites => {

			Promise.all(offlineFavorites.map(offlineFavorite => {
				const restaurantId = offlineFavorite.restaurant_id;
				const isFav = offlineFavorite.is_favorite;
				const url = `http://localhost:1337/restaurants/${restaurantId}/?is_favorite=${isFav}`;
				const PUT = { method: 'PUT' };

				console.log(`put offlineFavorite to server restaurantId: ${restaurantId}`);
				return fetch(url, PUT).then(response => {
					if (!response.ok) return Promise.reject('unable to update favorite status.');

					return response.json();
				}).then(networkRestuarant => {
					console.log(`update restaurants restaurantId: ${restaurantId}`);
					const restaurantsTxn = db.transaction('restaurants', 'readwrite').objectStore('restaurants');

					return restaurantsTxn.get(networkRestuarant.id).then(idbRestaurant => {
        				restaurantsTxn.put(networkRestuarant);
        			}).then(() => {
						return restaurantsTxn.complete;
					});
				}).then(() => {
					console.log(`delete offlineFavorite restaurantId: ${restaurantId}`);

					const offlineFavoritesUpdateTxn = db.transaction('offline-favorites', 'readwrite').objectStore('offline-favorites');

					offlineFavoritesUpdateTxn.delete(restaurantId).then(() => {
						return offlineFavoritesUpdateTxn.complete;
					})
				});
			}));
		}).then(() => {
			return offlineFavoritesTxn.complete;
		});
	});
}

function syncOfflineReviews() {
	console.log('syncOfflineReviews started');

	// fetch all reviews
	// POSt to reviews
	// delete from offline-reviews

	return openDB('restaurant-reviews').then(db => {
		console.log('get offlineReviews from idb');

		const offlineReviewsTxn = db.transaction('offline-reviews').objectStore('offline-reviews');

		offlineReviewsTxn.getAll().then(offlineReviews => {
			return Promise.all(offlineReviews.map(offlineReview => {
				console.log(offlineReview);
			}));
		}).then(() => {
			return offlineReviewsTxn.complete;
		});
	});
}
