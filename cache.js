var CACHE_TTL = (process.env.CACHE_TTL && parseInt(process.env.CACHE_TTL, 10)) || 60 * 1000;
var cache;

/**
 * Get time from internal cache
 *
 * @returns {undefined|array} times
 */
function getCachedTime() {
  var result;
  if (cache && cache.time) {
    var cachedTime = cache.time;
    if (new Date() - cache.time < CACHE_TTL) {
      result = cache.data;
    }
  }
  return result;
}

/**
 * Update internal cache with BART times
 *
 * @param {number[]} times
 */
function setCachedTime(times) {
  cache = cache || {};
  cache.time = new Date();
  cache.data = times;
}

module.exports = {
  getCachedTime: getCachedTime,
  setCachedTime: setCachedTime
};