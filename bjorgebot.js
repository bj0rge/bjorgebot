var Twit = require('twit')
var Const = require('./constants');
 
var T = new Twit({
    consumer_key:         Const.CONSTANTS['consumer_key']
  , consumer_secret:      Const.CONSTANTS['consumer_secret']
  , access_token:         Const.CONSTANTS['access_token']
  , access_token_secret:  Const.CONSTANTS['access_token_secret']
})


/*
 * Gives the time since the tweet was posted
 * @params	tweet	json formated tweet
 * @return	diff	time since the tweet was posted (in seconds)
 */
function timeSincePosted(tweet) {
    var tweet_date = new Date(Date.parse(tweet.created_at));
    var now = new Date();
   
    var diff = Math.floor((now - tweet_date) / 1000);
	
    return diff;
}



function myCallback(err, data, response) {
	// console.log(JSON.stringify(data, null, 2));
	
	for (var tweetNb in data) {
		var tweet = data[tweetNb];
		var id = tweet.id;
		var userName = tweet.user.screen_name;
		var creationDate = tweet.created_at;
		
		lastId = (lastId < id) ? id : lastId;
		
		
		// We want to treat only recent posts
		if (timeSincePosted(tweet) < 5*60) {
		
			console.log("Le tweet de @" + userName + " a été posté il y a " + timeSincePosted(tweet) + " secondes. Son id est " + id + " et lastId est " + lastId);
			// console.log ("L'utilisateur qui a envoyé le tweet, c'est @" + userName);
			
			// T.post('statuses/update', { status: 'Salut @'+userName+', merci de ta charmante attention !' }, function(err, data, response) {
			  // console.log(data)
			// })
		}
	}
}


lastId = 0;

// Every 60s
setInterval( function(){
	// Get statuses

	if (lastId == 0) 
		T.get('statuses/mentions_timeline', { count: '5' }, myCallback);
	else
		T.get('statuses/mentions_timeline', { count: '5', since_id: lastId }, myCallback); 
}, (60*1000)) 


