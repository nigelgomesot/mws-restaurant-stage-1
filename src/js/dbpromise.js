// REF: https://github.com/jakearchibald/idb/blob/master/changes.md

import { openDB } from 'idb';

export function db() {
	return openDB('restaurant-reviews', 4, {
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
        case 2:
          db.createObjectStore('offline-favorites', {
            keyPath: 'restaurant_id'
          });
        case 3:
          db.createObjectStore('offline-reviews', {
            autoIncrement: true
          }).createIndex(
            'restaurant_id', 'restaurant_id'
          );
      }
    }
  });
}

export function putRestaurants(restaurants, forceUpdate = false) {
  if(!restaurants.push) restaurants = [restaurants];
  return db().then(db => {
    const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');

    Promise.all(restaurants.map(networkRestuarant => {
      return store.get(networkRestuarant.id).then(idbRestaurant => {
        if (forceUpdate) return store.put(networkRestuarant);
        if (!idbRestaurant || new Date(networkRestuarant.updatedAt) > new Date(idbRestaurant.updatedAt)) {
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
        if (!idbReview || new Date(networkReview.updatedAt) > new Date(idbReview.updatedAt)) {
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

export function putOfflineFavorite(restaurant_id, is_favorite) {
  return db().then(db => {
    const store = db.transaction('offline-favorites', 'readwrite').objectStore('offline-favorites');

    const offlineFavorite = {
      restaurant_id: restaurant_id,
      is_favorite: is_favorite,
    };

    store.put(offlineFavorite).then(() => store.complete).catch(err => {
      console.error(`putOfflineFavorite failed: restaurant_id: ${restaurant_id}, err: ${err}`)
    });
  });
}

export function putOfflineReview(review) {
  return db().then(db => {
    const offlineReviewTxn = db.transaction('offline-reviews', 'readwrite').objectStore('offline-reviews');

    const offlineReview = {
      restaurant_id: review.restaurant_id,
      review: review
    };

    offlineReviewTxn.put(offlineReview).then(() => {
      return offlineReviewTxn.complete;
    }).catch(err => {
      console.error(`putOfflineReview failed: restaurant_id: ${review.restaurant_id}, err: ${err}`);
    });
  });
}