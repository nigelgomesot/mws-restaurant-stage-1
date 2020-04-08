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

		return resonse.json();
	}).then(updatedRestaurant => {
		// update IDB
		DBPromise.putRestaurants(updatedRestaurant, true);

		// change toggle button
		this.setAttribute('aria-pressed', !isFav);
	});
}

export default function favoriteButton(restaurant) {
	const button = document.createElement('button');
	button.innerHTML = "&#x2764;"
	button.className = 'fav';
	button.dataset.id = restaurant.id;
	button.setAttribute('aria-label', `Mark ${restaurant.name} as favorite`);
	button.setAttribute('aria-pressed', restaurant.is_favorite);
	button.onclick = handleClick;

	return button;
}
