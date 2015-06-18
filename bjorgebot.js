var Twit = require('twit')
var Const = require('./constants');
var http = require('http');
 
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
 * Send a GET request to brewrydb
 * @params	path	string		the path of the request 
 * 			data	array		the parameters of the request
 */
function getRequest(path, data) {
  
	// Formating the parameters into the path
	var fullpath = path + "?";
	Object.keys(data).forEach(function(key){
		fullpath += key + "=" + data[key] + "&";
	});
	fullpath = fullpath.substring(0, fullpath.length - 1);

	// Setting request options
	var options = {
		  host : 'api.brewerydb.com', // here only the domain name
		  // (no http/https !)
		  port : 80,
		  path : fullpath, // the rest of the url with parameters if needed
		  method : 'GET', // do POST
	};

 
	// Set up the request
	var get_req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (res) {
			// here a callback instead of log
			console.log(res);
		});
	});

	// post the data
	get_req.write(JSON.stringify(data));
	get_req.end();

}


/*
 * Get last mentions and treat them
 */
function getAndTreatMentions(err, data, response) {
	// console.log(JSON.stringify(data, null, 2));
	
	// for each mentions
	for (var tweetNb = 0; tweetNb < data.length; tweetNb++) {
		// get informations
		var tweet = data[tweetNb];
		var id = tweet.id;
		var userName = tweet.user.screen_name;
		var creationDate = tweet.created_at;
		
		
		// We want to treat only recent posts
		if ((timeSincePosted(tweet) < 5*60) && (id != lastId)) {
		
			console.log("Le tweet de @" + userName + " a été posté il y a " + timeSincePosted(tweet) + " secondes. Son id est " + id + " et lastId est " + lastId);
			
			var Const = require('./constants');
			var data = {	
				"key" 		: Const.CONSTANTS['brewerydb_key'], 
				"type" 		: "beer", 
				"q" 		: "aventinus"
			};

					
			getRequest('/v2/search', data);
		}
		// For not getting oldest mentions
		lastId = (lastId < id) ? id : lastId;
	}
}


// needs to be global for the callback
lastId = 0;

// Every 60s
setInterval( function(){
	// Get statuses
	if (lastId == 0) {
		console.log("pas de lastid");
		T.get('statuses/mentions_timeline', { count: '5' }, getAndTreatMentions);
	}
	else {
		console.log("lastid = " + lastId);
		T.get('statuses/mentions_timeline', { count: '5', since_id: lastId }, getAndTreatMentions); 
	}
}, (6*1000)) 


