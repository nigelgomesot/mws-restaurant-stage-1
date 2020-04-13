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
