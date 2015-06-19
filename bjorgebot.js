var Twit = require('twit')
var Const = require('./constants');
var http = require('http');

/*
 * ##################################
 * ##################################
 */

var BreweryDb = require('brewerydb-node'); 
var brewdb = new BreweryDb(Const.CONSTANTS['brewerydb_key']);

/*
 * ##################################
 * ##################################
 */
 
var T = new Twit({
    consumer_key:         Const.CONSTANTS['consumer_key']
  , consumer_secret:      Const.CONSTANTS['consumer_secret']
  , access_token:         Const.CONSTANTS['access_token']
  , access_token_secret:  Const.CONSTANTS['access_token_secret']
})


/*
 * Gives the time since the tweet was posted
 * @params	tweet	array		json formated tweet
 * @return	diff	int			time since the tweet was posted (in seconds)
 */
function timeSincePosted(tweet) {
    var tweet_date = new Date(Date.parse(tweet.created_at));
    var now = new Date();
   
    var diff = Math.floor((now - tweet_date) / 1000);
	
    return diff;
}



/*
 * Get last mentions and treat them
 */
function getAndTreatMentions(err, data, response) {
	
	// for each mentions
	data.forEach(function (tweet) {
		// get informations
		// var tweet = data[i];
		var id = tweet.id;
		var userName = tweet.user.screen_name;
		var creationDate = tweet.created_at;
		
		
		// Replace all useless chars
		var message = tweet.text
				.replace("@"+Const.CONSTANTS['username'], "")
				.replace(":", "")
				.replace(".", "")
				.replace("+", " ")
				.replace(";", "")
				.replace("?", "")
				.replace("!", "")
				.replace(",", "")
				.replace ("  ", " ")
				.replace ("  ", " ");
		
		// We want to treat only recent posts
		if ((timeSincePosted(tweet) < 5*60) && (id != lastId)) {
							
			// TEMPORARY
			// var keyword = "Aventinus Weizen-Eisbock";
			var keyword = "Aventinus";
			var searchtype = "find".toLowerCase();

			// If we want to find
			if (searchtype == "find") {
				// First, we try to find the wanted beer
				brewdb.beer.find({ name:keyword }, function(err, data){
					// If there is a result, we found the beer. Yay!
					if (data){
						// Here we get the first result, we don't care about the year of brewing
						var beer = data[0];
						brewdb.beer.getById(beer.id, {}, function(err, data){
							// Special treatment if there is a picture
							var img = (beer.labels) ? "\nimage :" + beer.labels.medium : "";
							
							// CHANGE THE CONTENT OF IMG AND POST A TWEET W/ IMG IF NECESSARY
							// console.log("\nOnly one beer.\n_____\n\nName: " + beer.nameDisplay + "\nStyle: " + beer.style.shortName + "\nPlus d'infos: " + Const.CONSTANTS['beer_uri_base'] + beer.id + img);
							
							T.post('statuses/update', { status: '@'+userName+': ' + beer.nameDisplay +' - '+ beer.style.shortName + '\nMore infos: ' + Const.CONSTANTS['beer_uri_base'] + beer.id,
							'in_reply_to_status_id': id}, function(err, data, response) {
								console.log("status: " + '@'+userName+': ' + beer.nameDisplay +' - '+ beer.style.shortName + '\nMore infos: ' + Const.CONSTANTS['beer_uri_base'] + beer.id);
							});
							
							
							
							// T.post('statuses/update', { status: '@'+userName+', merci de ta charmante attention !' /* in_reply_to_status_id: id */ }, function(err, data, response) {
							  // console.log(data)
							// })
							
							// WE ALSO FOUND (if data.length > 1)
						}); 
						
					}
					// If there is no result, we tell the user
					else {
						console.log("\nSorry, we weren't able to find your beer. Please try another request :)");		
					}
				});
			}
			// if we want to search
			else if (searchtype == "search") {
				// Function search
				brewdb.search.beers({ q:keyword }, function(err, data){
					// If there is at least one beer found
					if (data){
						var beers = "";
						for (var i = 0; i < data.length; i++) {
							beers += data[i].name + ", ";
						}
						beers = beers.substring(0, (beers.length - 2));
						
						console.log("\nWe found: " + beers);
						// BE CAREFUL ABOUT 140 CHARS!
					}
					// If no result
					else {
						console.log("\nSorry, we weren't able to find your beer. Please try another request :)");
					}
				});
			}
			// if the answer is not correctly formatted 
			else {
				console.log("@user You should send me a message starting with 'find' or 'search', then the beer name you want infos about.")
			}

		}
		// For not getting oldest mentions
		lastId = (lastId < id) ? id : lastId;
	});
}


// needs to be global for the callback
lastId = 0;

// Every 60s
setInterval( function(){
	// Get statuses
	if (lastId == 0) {
		T.get('statuses/mentions_timeline', { count: '5' }, getAndTreatMentions);
	}
	else {
		T.get('statuses/mentions_timeline', { count: '5', since_id: lastId }, getAndTreatMentions); 
	}
}, (6*1000)) 


