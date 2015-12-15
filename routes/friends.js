var mq_client = require('../rpc/client');

function getUserFriends(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userId": req.session.userId};
	msg_payload.apiCall = "getUserFriends";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		
		console.log("results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in getUserFriends");
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('error', {message: "Error in getUserFriends"});
			}
			else {    
				console.log("Success in GetFriends--");
				res.send('', {userFriends: results.userFriends, userRequests: results.userRequests});
				
			}
		}  
	});	
}

exports.getUserFriends = getUserFriends;

function unfriendUser(req,res) {
	var msg_payload = {};
	console.log("FriendID: " +req.param("friend_id"));
	msg_payload.queryParams = { "userid": req.session.userId, "friendid" : req.param("friend_id")};
	msg_payload.apiCall = "unfriendUser";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		
		console.log("results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in unfriendUser");
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('error', {message: "Error in unfriendUser"});
			}
			console.log("Success in unfriendUser");
			res.send('/');
		}  
	});	
}

exports.unfriendUser = unfriendUser;

function getUserProfile(req,res) {
	var msg_payload = {};
	console.log("In getUserProfile. FriendId: "+req.param("userId")+" UserId:"+req.session.userId)
	if(req.session.userId==req.param("userId")) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('welcomePage', { "username" : JSON.stringify(req.session.username)});
	} else {
		msg_payload.queryParams = { "userid": req.session.userId, "friendid" : req.param("userId")};
		msg_payload.apiCall = "getUserProfile";
		console.log("msg_payload.queryParams: " + msg_payload.queryParams);
		
		mq_client.make_request('friends_queue',msg_payload, function(err,results){
			
			console.log("results" + results);
			if(err){
				throw err;
			}
			else 
			{
				if(results.code == 401){
					console.log("Error in getUserProfile");
					res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render('error', {message: "Error in getUserProfile"});
				}
				//console.log("Success in unfriendUser: " +results.isFriend);
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('friendProfile',{"isFriend":JSON.stringify(results.isFriend), "friendId":JSON.stringify(req.param("userId")), "username": JSON.stringify(req.session.username)});
			}  
		});	
	}
}

exports.getUserProfile = getUserProfile;

function getFriendName(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = {"_id" : req.param("friendId")};
	msg_payload.apiCall = "getFriendName";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		
		console.log("results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.noUser) {
				res.send('friendProfile', { "noUser" : "No such user exists"});
			} else {
				res.send('friendProfile', { "userData" : results.userData});
			}
		}  
	});	
}

exports.getFriendName = getFriendName;

function getFriendAbout(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.param("friendId")};
	msg_payload.apiCall = "getFriendAbout";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		
		console.log("results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.userAbout) {
				console.log(JSON.stringify({ "userAbout" : results.userAbout}));
				res.send('friendProfile', { "userAbout" : (results.userAbout), 'noData':false, "userEvents": results.userEvents});
			} else {
				var defaultValues = {description:'', dateOfBirth:'', education:'', employment:'',contactNumber:''};
				res.send('friendProfile', { "userAbout" : defaultValues, 'noData':true, "userEvents": results.userEvents});
			}
		}  
	});	
}
exports.getFriendAbout = getFriendAbout;

function getFriendFriends(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid_1": req.param("friendId")};
	msg_payload.apiCall = "getFriendFriends";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		
		console.log("getFriendFriends results" + results);
		if(err){
			throw err;
		}
		else 
		{
			res.send('/', { "userFriends" : results.userFriends});
		}  
	});	
}

exports.getFriendFriends = getFriendFriends;

function getFriendInterests(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.param("friendId")};
	msg_payload.apiCall = "getFriendInterests";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		
		console.log("getFriendInterests results" + JSON.stringify(results.userInterests.books));
		console.log("getFriendInterests results2" + JSON.stringify(results.userInterests.music));
		if(err){
			throw err;
		}
		else 
		{
			console.log("getFriendInterests success");
			res.send('/',  {"music": (results.userInterests.music), "sports": (results.userInterests.sports), "shows": (results.userInterests.shows), "movies": (results.userInterests.movies), "books": (results.userInterests.books)});
		}  
	});	
}

exports.getFriendInterests = getFriendInterests;

function getFriendRequestStatus(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId, "friendid": req.param("friendId")};
	msg_payload.apiCall = "getFriendRequestStatus";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			console.log("Success in getFriendRequestStatus" + JSON.stringify(results.requestStatus));
			if(results.friendRequestId) {
				res.send('/',{"requestStatus":results.requestStatus, "friendRequestId": results.friendRequestId});
			} else {
				res.send('/',{"requestStatus":results.requestStatus});
			}
		}  
	});	
}

exports.getFriendRequestStatus = getFriendRequestStatus;

function acceptRequest(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = {"requestid": req.param("friendRequestId"), "friendid": req.param("friendId"), "userid":req.session.userId};
	msg_payload.apiCall = "acceptRequest";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==200) {
				console.log("Success in acceptRequest");
				res.send('/',{"isFriend":true});
			} else {
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('error', {message: "Error in getNewsFeed"});
			}
			
		}  
	});	
}

exports.acceptRequest = acceptRequest;

function declineRequest(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = {"requestid": req.param("friendRequestId")};
	msg_payload.apiCall = "declineRequest";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==200) {
				console.log("Success in declineRequest");
				res.send('friendProfile',{"isFriend":false});
			} else {
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('error', {message: "Error in getNewsFeed"});
			}
			
		}  
	});	
}

exports.declineRequest = declineRequest;

function addAsFriend(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = {"requesteeid": req.param("friendId"), "requesterid":req.session.userId};
	msg_payload.apiCall = "addAsFriend";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==200) {
				console.log("Success in declineRequest");
				res.send('friendProfile',{"isFriend":false});
			} else {
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('error', {message: "Error in getNewsFeed"});
			}
		}  
	});	
}

exports.addAsFriend = addAsFriend;

function cancelRequest(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = {"requesteeid": req.param("friendId"), "requesterid":req.session.userId};
	msg_payload.apiCall = "cancelRequest";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('friends_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==200) {
				console.log("Success in cancelRequest");
				res.send('friendProfile',{"isFriend":false});
			} else {
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('error', {message: "Error in getNewsFeed"});
			}
		}  
	});	
}

exports.cancelRequest = cancelRequest;