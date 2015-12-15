var mq_client = require('../rpc/client');

function searchRequest(req,res) {
	var msg_payload = {};
	//msg_payload.queryParams = { "userId": req.session.userId, "searchQuery": ('^'+req.param("searchQuery"))};
	msg_payload.queryParams = {"searchQuery": ('^'+req.param("searchQuery")), "userid":req.session.userId};
	msg_payload.apiCall = "searchRequest";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		
		console.log("searchRequest results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in searchRequest");
				throw err;
			}
			else {    
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('search', {"username": JSON.stringify(req.session.username), "userResults" : JSON.stringify(results.userResults), "groupResults": JSON.stringify(results.groupResults)});
				
			}
		}  
	});	
}

exports.searchRequest = searchRequest;