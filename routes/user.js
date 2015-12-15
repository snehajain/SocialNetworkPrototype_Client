var ejs = require("ejs");
var mq_client = require('../rpc/client');

function getUserAbout(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId};
	msg_payload.apiCall = "getUserAbout";
	console.log("msg_payload.queryParams: " +msg_payload.queryParams);
	
	mq_client.make_request('user_queue',msg_payload, function(err,results){
		
		console.log("getUserAbout results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in get UserAbout");
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('index',  {  title: 'Invalid Login'});
			}
			else {    
				if(results.userAbout) {
					console.log(JSON.stringify({ "userAbout" : (results.userAbout)}));
					res.send('welcomePage', { "userAbout" : results.userAbout, 'noData':false, "userEvents": results.userEvents});
				} else {
					var defaultValues = {description:'', dateOfBirth:'', education:'', employment:'',contactNumber:''};
					res.send('welcomePage', { "userAbout" : defaultValues, 'noData':true, "userEvents": results.userEvents});
				}
			}
		}  
	});
	
}

exports.getUserAbout = getUserAbout;

function editAbout(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId};
	msg_payload.apiCall = "editAbout";
	msg_payload.setParams = req.param("userAbout");
	for(key in msg_payload.setParams) {
		var newKey = key.split(" ").join("");
		newKey =  newKey.substring(0,1).toLowerCase() + newKey.substring(1);
		console.log(key + " To "+newKey);
		msg_payload.setParams[newKey] = msg_payload.setParams[key];
		delete msg_payload.setParams[key];
	}
	console.log("msg_payload.queryParams: " +msg_payload.queryParams);
	console.log("Json data: " + JSON.stringify(req.param("userAbout")));
	
	mq_client.make_request('user_queue',msg_payload, function(err,results){
		
		console.log("editAbout results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in edit UserAbout");
				throw err;
			} else {
				res.send('/');
			}
		}  
	});
	
}

exports.editAbout = editAbout;