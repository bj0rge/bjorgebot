# bjorgebot
A bot for twitter which get infos about beers

# Installation

- Run `npm install` for installing dependencies.
- Create a file named `constants.js` with the following content:

```javascript
var CONSTANTS = {
	'consumer_key'			: 	'YOUR_TWITTER_CONSUMER_KEY',
	'consumer_secret'		:	'YOUR_TWITTER_CONSUMER_SECRET',
	'access_token'			:	'YOUR_TWITTER_ACCESS_TOKEN',
	'access_token_secret'	:	'YOUR_TWITTER_TOKEN_SECRET',
	
	'brewerydb_key'			:	'YOUR_BREWERTDB_KEY'
};

module.exports.CONSTANTS = CONSTANTS;
```

