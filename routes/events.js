var ejs = require("ejs");
var mq_client = require('../rpc/client');

function addEvent(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId, "newEvent": req.param("newEvent")};
	msg_payload.apiCall = "addEvent";
	console.log("msg_payload.queryParams: " +msg_payload.queryParams);
	
	mq_client.make_request('user_queue',msg_payload, function(err,results){
		
		console.log("addEvent results " + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Invalid addEvent");
				res.render('error',  {message: "Error in Add Event"});
			}
			else {    
				console.log("valid addEvent");
				res.send('/');
				
			}
		}  
	});
	
}

exports.addEvent = addEvent;