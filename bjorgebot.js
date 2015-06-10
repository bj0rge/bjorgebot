var Twit = require('twit')
 
var T = new Twit({
    consumer_key:         'jXDHkMYCz362BYvMTrnb5XqPn'
  , consumer_secret:      'iIJ9LttDIeXMtLvWKTeoMpPekUsOzuFirz22ad9mWdagHM0CNJ'
  , access_token:         '3246418552-mecct9MTpmBS28Xn5CUKwRzOett1Phc9kT1vicm'
  , access_token_secret:  '05oQTgKmbL1Ia5jaQth0zivX11rLTinwlDCebtwEPZg37'
})



function myCallback(err, data, response) {
	// console.log(JSON.stringify(data, null, 2));
	
	for (var tweetNb in data) {
		var tweet = data[tweetNb];
		var id = tweet.id;
		var userName = tweet.user.screen_name;
		
		lastId = (lastId < id) ? id : lastId;
		
		
		
		// console.log ("L'utilisateur qui a envoyé le tweet, c'est @" + userName);
		
		T.post('statuses/update', { status: 'Salut @'+userName+', merci de ta charmante attention !' }, function(err, data, response) {
		  console.log(data)
		})
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


