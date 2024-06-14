"use strict";

const api_key = "7c47f04720024f75b9651754241406";
const base_URL = "https://api.weatherapi.com/v1/";

/**
 * Fetch data from server
 * @param {string} URL API url
 * @param {Function} callback callback
 **/

export async function fetchData(url, callback) {
  const res = await fetch(`${url}&appid=${api_key}`);
  const date = await res.json();

  callback(date);
}

export const url = {
  /**
   *  Geolocation User
   * @param {string} lat latitude
   * @param {string} lon longitude
   * @returns {string} API
   */

  forecast(lat, lon, queries = "") {
    return `${base_URL}forecast.json?key=${api_key}&q=${lat},${lon}&aqi=yes${
      queries && `&${queries}`
    }`;
  },

  /**
   *
   * @param {string} query Value Of City Search
   * @returns {string} API
   */
  searchGeo(query) {
    return `${base_URL}search.json?key=${api_key}&q=${query}`;
  },
};
