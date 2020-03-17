import dbPromise from './dbpromise';
console.log(dbPromise);

/**
 * Common database helper functions.
 */
export default class DBHelper {

  static get API_BASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}`;
  }

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 8000 // Change this to your server port
    return `http://localhost:${port}/data/restaurants.json`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    // xhr.open('GET', DBHelper.DATABASE_URL);
     xhr.open('GET', `${DBHelper.API_BASE_URL}/restaurants`);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        // const json = JSON.parse(xhr.responseText);
        // const restaurants = json.restaurants;
        const restaurants = JSON.parse(xhr.responseText);
        dbPromise.putRestaurants(restaurants);
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}, trying idb...`);
        //callback(error, null);
        console.warn(error);

        dbPromise.getRestaurants().then(idbRestaurants => {

          if (idbRestaurants.length > 0) {
            callback(null, idbRestaurants);
          } else {
            callback('no restaurants found in idb', null);
          }
        });
      }
    };

    xhr.onerror = () => {
      console.warn('Error while trying xhr, trying idb...');

      dbPromise.getRestaurants().then(idbRestaurants => {
        if (idbRestaurants.length > 0) {
          callback(null, idbRestaurants);
        } else {
          callback('no restaurants found in idb', null);
        }
      });
    }
    xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.
   */
  // static fetchRestaurantById(id, callback) {
  //   // fetch all restaurants with proper error handling.
  //   DBHelper.fetchRestaurants((error, restaurants) => {
  //     if (error) {
  //       callback(error, null);
  //     } else {
  //       const restaurant = restaurants.find(r => r.id == id);
  //       if (restaurant) { // Got the restaurant
  //         callback(null, restaurant);
  //       } else { // Restaurant does not exist in the database
  //         callback('Restaurant does not exist', null);
  //       }
  //     }
  //   });
  // }

  static fetchRestaurantById(id, callback) {
    fetch(`${DBHelper.API_BASE_URL}/restaurants/${id}`).then(response => {
      if (!response.ok) {
        return Promise.reject("unable to fetch restaurant");
      }

      return response.json();
    }).then(fetchedRestaurant => {
      return callback(null, fetchedRestaurant);
    }).catch(networkError => {
      return callback(networkError, null);
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL. It defaults to a medium sized image. It uses restaurant.photograph
   * and fallbacks to restaurant.id if former is missing
   */
  static imageUrlForRestaurant(restaurant) {
    let url = `/img/${(restaurant.photograph||restaurant.id)}-medium.jpeg`;
    return url;
  }

  /**
   * Restaurant srcset attribute for browser to decide best resolution. It uses restaurant.photograph
   * and fallbacks to restaurant.id if former is missing.
   */
  static imageSrcsetForRestaurant(restaurant) {
    const imageSrc = `/img/${(restaurant.photograph||restaurant.id)}`;

    return `${imageSrc}-small.jpeg 300w,
            ${imageSrc}-medium.jpeg 600w,
            ${imageSrc}-large.jpeg 800w`;
  }

  /**
   * Restaurant sizes attribute so browser knows image sizes before deciding
   * what image to download.
   */
  static imageSizesForRestaurant(restaurant) {
    return `(max-width: 360px) 280px,
            (max-width: 600px) 600px,
            400px`;
  }

  static imageAltForRestaurant(restaurant) {
    return `Image of ${restaurant.name} restaurant`;
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(map);
    return marker;
  } 
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

  static mapOffline() {
    const map = document.getElementById('map');
    map.className = 'map-offline';
    map.innerHTML = `<div class="warning-icon">!</div>
    <div class="warning-message">Unable to load maps</div>
    <div class="warning-description">Are you offline? if you need maps please try after sometime.</div>`;
  }

}

DBHelper.dbPromise = dbPromise;