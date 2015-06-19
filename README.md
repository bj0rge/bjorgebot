# bjorgebot
A bot for twitter which gives infos about beers

# Informations

bjorgebot is a bot which gives informations about beers (cause, you know... Well, I'm the president of Club Bières UTT...).

## What webservices does it uses?

bjorgebot is based on two different APIs:

- Twitter API for getting mentions & posting infos
	- Infos: [Twitter API](https://dev.twitter.com/rest/reference/get/statuses/mentions_timeline)
	- Based on: [Twit package](https://www.npmjs.com/package/twit)
- BreweryDB for getting infos about beers
	- Infos: [BreweryDB API](http://www.brewerydb.com/developers/docs)
	- Based on: [brewerydb-node package](https://www.npmjs.com/package/brewerydb-node)

## How do I use it?

You only have to send a tweet mentioning the Twitter user and let it explain to you.

If you are in a hurry, you have two ways to ask him stuff, with `find` or `search` keyword (the first one is for when you already know the exact name of your beer, the second one for searching). In my case:

```
@bj0rge2 search Aventinus
@bj0rge2: find Orval Trappist Ale
@bjorge2 find Punk IPA
```

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

