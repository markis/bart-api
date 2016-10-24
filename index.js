var http = require('http');
var cache = require('./cache');

var PORT = process.env.PORT || 8000;
var BART_ORIG = process.env.BART_ORIG || 'SSAN';
var BART_PLAT = process.env.BART_PLAT || '2';
var BART_KEY = process.env.BART_KEY || 'MW9S-E7SL-26DU-VV8V';

http.createServer(httpHandler).listen(PORT);

/**
 * Main HTTP Handler
 *
 * @param {any} request
 * @param {any} response
 */
function httpHandler (request, response) {
  var enableCors = !!request.headers['origin'];

  var times = cache.getCachedTime();
  if (times) {
    respond(response, 200, times, enableCors);
  } else {
    getBartData(BART_KEY, BART_ORIG, BART_PLAT, function(status, data) {
      times = getTimes(data);
      if (times) {
        cache.setCachedTime(times);
      } else {
        times = cache.getStaleTime();
      }
      respond(response, status, times, enableCors);
    });
  }
}

/**
 * Response Handler
 *
 * @param {any} response
 * @param {number[]} times
 * @param {boolean} enableCors
 */
function respond(response, status, times, enableCors) {
  if (enableCors) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    response.setHeader('Access-Control-Max-Age', '86400');
  }

  var data = JSON.stringify(times);
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Content-Length', data && data.length || 0);
  if (status === 200) {
    response.setHeader('Cache-Control', 'public, max-age=60');
  }
  response.writeHead(status || 500);
  response.end(data);
}

/**
 * Parse the BART API XML and return estimated times
 *
 * @param {string} result
 * @returns {number[]} times
 */
function getTimes(result) {
  // find all the <minutes>##</minutes> in the xml string
  var matches = result.match(/([0-9]+)\<\/minutes\>/g);
  // convert strings to int, filter out bad numbers and then sort
  return matches && matches
      .map(function(time) { return parseInt(time, 10); })
      .filter(function(time) { return time > 0 })
      .sort(function(a, b) { return a > b ? 1 : b > a ? -1 : 0; });
}

/**
 * Get Estimated Times from BART API
 *
 * @param {string} key - BART API Key
 * @param {string} orig - Origin BART Station
 * @param {string} plat - Bart Platform
 * @param {function} callback
 */
function getBartData(key, orig, plat, callback) {
  http.get({
    host: 'api.bart.gov',
    path: '/api/etd.aspx?cmd=etd&orig=' + orig + '&plat=' + plat + '&key=' + key
  }, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      callback(response.status, body);
    });
  });
}