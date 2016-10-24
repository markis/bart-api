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
      var since = Math.round((new Date() - cache.time) / CACHE_TTL);
      result = cache.data.map(function(time) { return time - since; });
      result = result.filter(function (time) { return time > 0; })
    }
  }
  return result;
}

/**
 * Get time regardless of if it is still valid
 *
 * @returns {undefined|array} times
 */
function getStaleTime() {
  var result;
  if (cache && cache.time) {
    var since = Math.round((new Date() - cache.time) / 60000);

    result = cache.data.map(function(time) { return time - since; });
    result = result.filter(function (time) { return time > 0; })
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
  getStaleTime: getStaleTime,
  setCachedTime: setCachedTime
};