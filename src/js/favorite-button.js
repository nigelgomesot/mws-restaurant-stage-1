import * as DBHelper from './dbhelper';
import * as DBPromise from './dbpromise';

function handleClick() {
	const restaurantId = this.dataset.id;
	const isFav = this.getAttribute('aria-pressed') === 'true';
	const url = `${DBHelper.api_base_url()}/restaurants/${restaurantId}/?is_favorite=${!isFav}`;
	const PUT = { method: 'PUT' };

	// TODO: use Background Sync to sync data with API server
	return fetch(url, PUT).then(response => {
		if (!response.ok) return Promise.reject('unable to update favorite status.');

		return response.json();
	}).then(updatedRestaurant => {
		// update IDB
		DBPromise.putRestaurants(updatedRestaurant, true);

		// change toggle button
		this.setAttribute('aria-pressed', !isFav);
	});
}

function getIsFavValue() {
	return this.getAttribute('aria-pressed') === 'true';
}

function setIsFavValue(value) {
	this.setAttribute('aria-pressed', value);
}

function handleClick2() {
	if ('serviceWorker' in navigator && 'SyncManager' in window) {
		return handleWithBackgroundSync.call(this);
	}

	handleClick.call(this);
}

function handleWithBackgroundSync() {
	console.log('handleWithBackgroundSync:');

	// update restaurants idb
	// add to offline favorites

	DBPromise.getRestaurants(this.dataset.id)
	.then(idbRestaurant => {
		console.log(`creating in memory, restaurant_id: ${idbRestaurant.id}`);

		const isFav = !getIsFavValue.call(this);
		const updatedAt = new Date().toISOString();
		idbRestaurant.is_favorite = isFav;
		idbRestaurant.updatedAt = updatedAt;

		return idbRestaurant;
	}).then(updatedRestaurant => {
		console.log(`updating restaurants DB, restaurant_id: ${updatedRestaurant.id}`);

		DBPromise.putRestaurants(updatedRestaurant);

		return updatedRestaurant;
	}).then(updatedRestaurant => {
		console.log(`updating offline-favorites DB, restaurant_id: ${updatedRestaurant.id}`);

		DBPromise.putOfflineFavorite(updatedRestaurant.id, updatedRestaurant.is_favorite);

		return updatedRestaurant;
	}).then(updatedRestaurant => {
		console.log(`updating view page, restaurant_id: ${updatedRestaurant.id}`);

		setIsFavValue.call(this, updatedRestaurant.is_favorite);
	});
}


export default function favoriteButton(restaurant) {
	const button = document.createElement('button');
	button.innerHTML = "&#x2764;"
	button.className = 'fav';
	button.dataset.id = restaurant.id;
	button.setAttribute('aria-label', `Mark ${restaurant.name} as favorite`);
	button.setAttribute('aria-pressed', restaurant.is_favorite);
	button.onclick = handleClick2;

	return button
}
