// REF: https://github.com/jakearchibald/idb/blob/master/changes.md

import { openDB } from 'idb';

export function db() {
	return openDB('restaurant-reviews', 2, {
    upgrade(db, oldVersion, newVersion, transaction) {
      let store;

      switch(oldVersion) {
        case 0:
          db.createObjectStore('restaurants', {
            keyPath: 'id'
          });
        case 1:
          db.createObjectStore('reviews', {
            keyPath: 'id'
          }).createIndex(
            'restaurant_id', 'restaurant_id'
          );
      }
    }
  });
}

export function putRestaurants(restaurants) {
  if(!restaurants.push) restaurants = [restaurants];
  return db().then(db => {
    const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');

    Promise.all(restaurants.map(networkRestuarant => {
      return store.get(networkRestuarant.id).then(idbRestaurant => {
        if (!idbRestaurant || networkRestuarant.updatedAt > idbRestaurant.updatedAt) {
          return store.put(networkRestuarant);
        }
      });
    })).then(function () {
      return store.complete;
    });
  });
}

export function getRestaurants(id = undefined) {
  return db().then(db => {
    const store = db.transaction('restaurants').objectStore('restaurants');

    if (id) return store.get(Number(id));

    return store.getAll();
  });
}

export function putReviews(reviews) {
  if (!reviews.push) reviews = [reviews];

  return db().then(db => {
    const store = db.transaction('reviews', 'readwrite').objectStore('reviews');

    Promise.all(reviews.map(networkReview => {
      return store.get(networkReview.id).then(idbReview => {
        if (!idbReview || networkReview.updatedAt > idbReview.updatedAt) {
          return store.put(networkReview);
        }
      });
    })).then(function () {
      return store.complete;
    });
  });
}

export function getReviewsForRestaurant(id) {
  return db().then(db => {
    const storeIndex = db.transaction('reviews').objectStore('reviews').index('restaurant_id');

    return storeIndex.getAll(Number(id));
  });
}