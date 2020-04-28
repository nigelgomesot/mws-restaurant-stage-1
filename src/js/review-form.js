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

	const restaurant_id = document.getElementById('review-form').dataset.restaurantId;
	data.restaurant_id = Number(restaurant_id);

	data.createdAt = new Date().toISOString();

	return data;
}

function handleSubmit(e) {
	e.preventDefault();

	const review = validateAndGetData();
	if (!review) return;
	console.log(review);

	const url =  `${DBHelper.api_base_url()}/reviews`;
	const POST = {
		method: 'POST',
		body: JSON.stringify(review)
	};

	return fetch(url, POST).then(response => {
		if (!response.ok) return Promise.reject('post review failed.');

		return response.json();
	}).then(newNetworkReview => {
		DBPromise.putReviews(newNetworkReview);
		const reviewList = document.getElementById('reviews-list');
		const newReview = createReviewHTML(newNetworkReview);
		reviewList.appendChild(newReview);

		clearForm();
	});
}

function handleSubmit2(e) {
	if ('serviceWorker' in navigator && 'SyncManager' in window) {
		return handleSubmitWithBackgroundSync(e);
	}

	handleSubmit(e);
}

function handleSubmitWithBackgroundSync(e) {
	console.log('handleSubmitWithBackgroundSync');

	e.preventDefault();

	// store new review in offline-reviews
	// trigger backgroundSync
}

export default function reviewForm(restaurantId) {
	const form = document.createElement('form');
	form.id = 'review-form';
	form.dataset.restaurantId = restaurantId;

	// Name input
	let p = document.createElement('p');
	const name = document.createElement('input');
	name.id = 'name';
	name.setAttribute('type', 'text');
	name.setAttribute('aria-label', 'Name');
	name.setAttribute('placeholder', 'Enter your name');
	p.appendChild(name);
	form.appendChild(p);

	// Rating select
	p = document.createElement('p');
	const selectLabel = document.createElement('label');
	selectLabel.setAttribute('for', 'rating');
	selectLabel.innerText = 'Select rating: ';
	p.appendChild(selectLabel);
	const rating = document.createElement('select');
	rating.id = 'rating';
	rating.name = 'rating';
	rating.classList.add('rating');
	['--', 1, 2, 3, 4, 5].forEach(number => {
		const option = document.createElement('option');
		option.value = number;
		option.innerHTML = number;
		if (number === '--') option.selectedIndex = true;
		rating.appendChild(option);
	});
	p.appendChild(rating);
	form.appendChild(p);

	// Comment textarea
	p = document.createElement('p');
	const comments = document.createElement('textarea');
	comments.id = 'comments';
	comments.setAttribute('aria-label', 'Comments');
	comments.setAttribute('placeholder', 'Enter comments here.')
	comments.setAttribute('rows', '10');
	p.appendChild(comments);
	form.appendChild(p);

	// Add button
	p = document.createElement('p');
	const addButton = document.createElement('button');
	addButton.setAttribute('type', 'submit');
	addButton.setAttribute('aria-label', 'Add a Review');
	addButton.classList.add('add-review');
	addButton.innerHTML = "<span>+</span>";
	p.appendChild(addButton);
	form.appendChild(p);

	form.onsubmit = handleSubmit2;

	return form;
};
