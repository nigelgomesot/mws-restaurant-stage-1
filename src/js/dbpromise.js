// REF: https://github.com/jakearchibald/idb/blob/master/changes.md

import { openDB } from 'idb';

export const dbPromise = {
	db: openDB('restaurant-reviews', 1, function(upgradeDb) {
	 switch (upgradeDb.oldVersion) {
      case 0:
        upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
    }
	}),

  putRestuarants(restaurants) {
    if(!restaurants.push) restaurants = [restaurants];

    return this.db.then(db => {
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
  },

  getRestaurants(id = undefined) {
    return this.db.then(db => {
      const store = db.transaction('restaurants').objectStore('restaurants');

      if (id) return store.get(Number(id));

      return store.getAll();
    });
  },

};
