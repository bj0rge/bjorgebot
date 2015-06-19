# bjorgebot
A bot for twitter which gives infos about beers

# Installation

- Run `npm install` for installing dependencies.
- Create a file named `constants.js` with the following content:

```javascript
var CONSTANTS = {
	'consumer_key'			: 	'YOUR_TWITTER_CONSUMER_KEY',
	'consumer_secret'		:	'YOUR_TWITTER_CONSUMER_SECRET',
	'access_token'			:	'YOUR_TWITTER_ACCESS_TOKEN',
	'access_token_secret'	:	'YOUR_TWITTER_TOKEN_SECRET',
	
	'brewerydb_key'			:	'YOUR_BREWERTDB_KEY',
	'username'				:	'YOUR_TWITTER_USERNAME',
	'beer_uri_base' 		:	'http://www.brewerydb.com/beer/'
};

module.exports.CONSTANTS = CONSTANTS;
```

