Personal BART API
-----------------

This is a personal project I worked on, that will just hit the BART API with hard coded parameters and return only the exact results I need.

This is meant to be deployed to Heroku and the following configuration settings can be over-ridden:

* BART_KEY - api key that BART assigns to your account.  The one in the code is the test api key.
* BART_ORIG - the origin station to request times (default SSAN)
* BART_PLAT - the specific platform (1 or 2) to receive times (default 2)
* CACHE_TTL - the time to hold on to the time values