var Twit = require('twit')
var Const = require('./constants');
var http = require('http');

var BreweryDb = require('brewerydb-node'); 
var brewdb = new BreweryDb(Const.CONSTANTS['brewerydb_key']);

 
var T = new Twit({
    consumer_key:         Const.CONSTANTS['consumer_key']
  , consumer_secret:      Const.CONSTANTS['consumer_secret']
  , access_token:         Const.CONSTANTS['access_token']
  , access_token_secret:  Const.CONSTANTS['access_token_secret']
})


/*
 * Gives the time since the tweet was posted
 * @params	tweet	array		json formated tweet
 * @return	int			time since the tweet was posted (in seconds)
 */
function timeSincePosted(tweet) {
    var tweet_date = new Date(Date.parse(tweet.created_at));
    var now = new Date();
   
    var diff = Math.floor((now - tweet_date) / 1000);
	
    return diff;
}

/*
 * Sends a tweet
 * @params	T			Twit instance	Instance of Twit object
 *			answer		string			The answer the bot will post
 *			callback	function		The function that will be executed when the request will be post
 */
function postTweet(T, answer, callback) {
	T.post('statuses/update', { status: answer }, function(err, data, response) {
		callback(data);
	});
}


/*
 * Format a message for making him less than 140 characters and add the mention
 * @params	username	string		The name of the receiver of the message
 *			message		string		The message to format
 * @returns	string	The formatted message
 */
function formatMessage(username, message) {
	message = "@" + username + " " + message;
	return (message.length <= 140) ? message : (message.substring(0,137) + "...");
}



/*
 * Get last mentions and treat them
 */
function getAndTreatMentions(err, data, response) {
	
	// for each mentions
	data.forEach(function (tweet) {
		// get informations
		var id = tweet.id;
		var userName = tweet.user.screen_name;
		var creationDate = tweet.created_at;
		
		
		// Replace all useless chars
		var message = tweet.text.toLowerCase()
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
		while (message.charAt(0) == ' ') {
			message = message.substring(1);
		}
		
		// We want to treat only recent posts
		if ((timeSincePosted(tweet) < 5*60) && (id != lastId)) {
			
			// We get the type of request & the keywords
			var searchtype = (message.split(" ")[0]) ? message.split(" ")[0].toLowerCase() : "nothing";
			var keyword = (message.split(" ")[1]) ? message.substring(searchtype.length+1) : "nothing";

			
			// If we want to find
			if (searchtype == "find" && keyword != "nothing") {
				// First, we try to find the wanted beer
				brewdb.beer.find({ name:keyword }, function(err, data){
					// If there is a result, we found the beer. Yay!
					if (data){
						// Here we get the first result, we don't care about the year of brewing
						var beer = data[0];
						brewdb.beer.getById(beer.id, {}, function(err, data){
							// Special treatment if there is a picture	
							// Temporary muted, we'll see if I have enough time for that
							// var img = (beer.labels) ? "\n" + beer.labels.medium : "";
							var img = "";
							
							var answer = formatMessage(userName,
								beer.nameDisplay +' - '+ beer.style.shortName + img+'\n\
								More infos: ' + Const.CONSTANTS['beer_uri_base'] + beer.id);
							
							postTweet(T,answer, function(data){
								console.log(answer);
							});
							
							
							
							
							// The bot also says it has found other beers
							brewdb.search.beers({ q:keyword }, function(err, data){
								// If there is at least one beer found
								if (data){
									var beers = "";
									for (var i = 0; i < data.length; i++) {
										beers += data[i].name + ", ";
									}
									beers = beers.substring(0, (beers.length - 2));
									
									var answer = formatMessage(userName,'We also found: ' + beers);
									
									postTweet(T,answer, function(data){
										console.log(answer);
									});
								}
							});
						}); 
						
					}
					// If there is no result, we tell the user
					else {
						var answer = formatMessage(userName, "Sorry, we weren't able to find your beer. Please try another request :)");
						postTweet(T,answer, function(data){
							console.log(answer);
						});
					}
				});
			}
			// if we want to search
			else if (searchtype == "search" && keyword != "nothing") {
				// Function search
				brewdb.search.beers({ q:keyword }, function(err, data){
					// If there is at least one beer found
					if (data){
						var beers = "";
						for (var i = 0; i < data.length; i++) {
							beers += data[i].name + ", ";
						}
						beers = beers.substring(0, (beers.length - 2));
						
						var answer = formatMessage(userName, 'We found: ' + beers);
						postTweet(T,answer, function(data){
							console.log(answer);
						});
					}
					// If no result
					else {
						var answer = formatMessage(userName, "Sorry, we weren't able to find your beer. Please try another request :)";
						postTweet(T,answer, function(data){
							console.log(answer);
						});
					}
				});
			}
			// if the answer is not correctly formatted 
			else {
				var answer = formatMessage(userName, "You should send me a message starting with 'find' or 'search', then the beer name you want infos about.";
				postTweet(T,answer, function(data){
					console.log(answer);
				});
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


