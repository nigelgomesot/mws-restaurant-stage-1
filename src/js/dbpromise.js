// REF: https://github.com/jakearchibald/idb/blob/master/changes.md

import { openDB } from 'idb';

export function db() {
	return openDB('restaurant-reviews', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      const store = db.createObjectStore('restaurants', {
        keyPath: 'id'
      });
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
