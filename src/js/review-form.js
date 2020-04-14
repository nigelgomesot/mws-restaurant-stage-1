import * as DBHelper from './dbhelper';
import * as DBPromise from './dbpromise';

function createReviewHTML(review) {
	const li = document.createElement('li');

	const name = document.createElement('p');
	name.innerHTML = review.name;
	li.appendChild(name);

	const date = document.createElement('p');
	date.innerHTML = new Date(review.createdAt).toLocaleDateString();
	li.appendChild(date);

	const rating = document.createElement('p');
	rating.innerHTML = `Rating: ${review.rating}`;
	li.appendChild(rating);

	const comments = document.createElement('p');
	comments.innerHTML = review.comments;
	li.appendChild(comments);

	return li;
}

function clearForm() {
	document.getElementById('name').value = '';
	document.getElementById('rating').selectedIndex = 0;
	document.getElementById('comments').value = '';
}

function validateAndGetData() {
	const data = {};

	const name = document.getElementById('name');
	if (name.value === '') {
		name.focus();
		return;
	}
	data.name = name.value;

	const ratingSelect = document.getElementById('rating');
	const rating_value = ratingSelect.options[ratingSelect.selectedIndex].value;
	if (rating_value === '--') {
		ratingSelect.focus();
		return;
	}
	data.rating = Number(rating_value);

	const comments = document.getElementById('comments');
	if (comments.value === '') {
		comments.focus();
		return;
	}
	data.comments = comments.value;

	const restaurantId = document.getElementById('review-form').dataset.restaurantId;
	data.restaurantId = Number(restaurantId);

	data.createdAt = new Date().toISOString();

	return data;
}
