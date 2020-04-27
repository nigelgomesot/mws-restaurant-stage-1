- details page: footer width
https://alexandroperez.github.io/mws-walkthrough/?1.15.responsive-images
https://alexandroperez.github.io/mws-walkthrough/?1.17.making-sure-app-is-responsive
https://alexandroperez.github.io/mws-walkthrough/?1.19.implementing-focus-and-skip-links
  - restaurant-info focus
  - footer focus
https://alexandroperez.github.io/mws-walkthrough/?1.23.registering-service-worker-and-caching-static-assets
  - activate step
https://alexandroperez.github.io/mws-walkthrough/?1.25.fixing-offline-mode
https://alexandroperez.github.io/mws-walkthrough/?1.26.service-worker-restaurant-requests-with-parameters
https://alexandroperez.github.io/mws-walkthrough/?1.27.service-worker-caching-responsive-images
https://alexandroperez.github.io/mws-walkthrough/?1.28.handling-offline-maps-with-custom-content

https://alexandroperez.github.io/mws-walkthrough/?2.1.cloning-and-running-the-rails-server
https://alexandroperez.github.io/mws-walkthrough/?2.2.gulp-with-watchify-browserify-and-browsersync
https://alexandroperez.github.io/mws-walkthrough/?2.3.fixing-code-to-work-with-new-gulp-setup
https://alexandroperez.github.io/mws-walkthrough/?2.4.fetching-data-from-the-sails-api-server
https://alexandroperez.github.io/mws-walkthrough/?2.5.setting-up-indexeddb-promised-for-offline-use
idb not loaded
dbPromise methods not accessible
	- REF: https://medium.com/javascript-in-plain-english/javascript-modules-for-beginners-56939088f7d9
	- unable to access dbPromise in static methods in class
	- https://exploringjs.com/es6/ch_modules.html
	- object literals with functions in es6 with export
	- replace DBHelper class with individual functions and use named exports
	- export functions call each other
	- fix IDB error
	  - upgrade DB not working
fix filters
	- dynamic options are not accessible for updateRestaurants
https://alexandroperez.github.io/mws-walkthrough/?2.5.setting-up-indexeddb-promised-for-offline-use
	- 5. Now refactor your fetchRestaurantsById helper method
https://alexandroperez.github.io/mws-walkthrough/?2.6.enabling-service-worker-and-getting-a-good-pwa-score
	- fix gulp to copy icons in dist directory DONE
	- fix pwa score
		- sw not registered
	- fix performance score
		- Defer offscreen images
			- large img is selected
				- issue is with Lighhouse(Nexus) selecting higher DPR image
					- REF: https://github.com/GoogleChrome/lighthouse/issues/4322
	- for index page; Replace fetch Cuisine, & fetch Neighbourhoods to promises to reduce number of restaurants fetch from 3 to 2.
		- uncomment import * as RegisterSW from './register-sw';
		- make fetchRestaurantsV2 thenable
https://alexandroperez.github.io/mws-walkthrough/?3.1.getting-reviews-from-new-sails-server
	- 9:00
	- 17:00
https://alexandroperez.github.io/mws-walkthrough/?3.2.upgrading-idb-for-restaurant-reviews
	- integrate getReviewsForRestaurant
	-  TODO: try to get reviews from idb
uncomment SW (main.js, restaurant_info.js)
https://alexandroperez.github.io/mws-walkthrough/?3.3.favorite-restaurants-using-accessible-toggle-buttons
	- 2. Create a new file src/js/favorite-button.js
	- 3. In src/js/main.js we'll import our favorite button
	- 5. Now we need to add a favorite button to our restaurant info page
https://alexandroperez.github.io/mws-walkthrough/?3.4.adding-a-form-for-new-reviews
	- function validateAndGetData()
	- function handleSubmit(e)
	- export default function reviewForm(restaurantId)
	- Add Button
https://alexandroperez.github.io/mws-walkthrough/?3.5.the-ultimate-challenge
	- sync favorites
		add to restaurants db
		add to offline favorites
		register event tag
		listen to event tag
		read from offline-favorites in sw
		fetch PUT request in sw
			Fix: Uncaught (in promise) DOMException: Failed to execute 'get' on 'IDBObjectStore
	- sync reviews

uncomment SW (main.js, restaurant_info.js)
Misc: when reviews are not fetched from network, change error message from `No reviews yet` to `Unable to fetch reviews`.
