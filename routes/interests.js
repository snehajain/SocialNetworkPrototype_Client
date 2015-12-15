var ejs = require("ejs");
var mq_client = require('../rpc/client');

function getUserInterests(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId};
	msg_payload.apiCall = "getUserInterests";

	mq_client.make_request('user_queue',msg_payload, function(err,results){
		
		console.log("getUserInterests results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in getUserInterests");
				throw err;
			}
			else {    
				res.send('/',  {"music": results.userInterests.music, "sports": results.userInterests.sports, "shows": results.userInterests.shows, "movies": results.userInterests.movies, "books": results.userInterests.books});
			}
		}  
	});
		//res.send('/');
}

exports.getUserInterests = getUserInterests;

function removeInterest(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId, "interest_id" : req.param("interest_id"), "interest_type" : req.param("type")};
	msg_payload.apiCall = "removeInterest";

	mq_client.make_request('user_queue',msg_payload, function(err,results){
		
		console.log("getUserInterests results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in getUserInterests");
				throw err;
			}
			else {    
				console.log("Success in getUserInterests");
				res.send('/');
			}
		}  
	});
}

exports.removeInterest = removeInterest;

function searchInterest(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId, "query_name" : req.param("queryName"), "interest_type" : req.param("interestType").toLowerCase()};
	//msg_payload.queryParams = { "userid": "56393f5ec8abf3b48f0750ca", "query_name" : req.param("queryName"), "interest_type" : req.param("interestType")};
	msg_payload.apiCall = "searchInterest";

	mq_client.make_request('user_queue',msg_payload, function(err,results){
		
		console.log("searchInterest results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in searchInterest");
				throw err;
			}
			else {    
				console.log("Success in searchInterest");
				res.send('/', {"searchResults": results.interests});
				//res.send('/')
			}
		}  
	});
}

exports.searchInterest = searchInterest;

function addInterest(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId, "interest" : req.param("interest")};
	msg_payload.apiCall = "addInterest";

	mq_client.make_request('user_queue',msg_payload, function(err,results){
		
		console.log("addInterest results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in addInterest");
				throw err;
			}
			else {    
				console.log("Success in addInterest");
				res.send('/');
			}
		}  
	});
}

exports.addInterest = addInterest;

function createInterest(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "title": req.param("title").replace("'","\\'"), "description": req.param("description").replace("'","\\'"), "interest_type": req.param("interest_type").toLowerCase()};
	msg_payload.apiCall = "createInterest";

	mq_client.make_request('user_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in createInterest");
				throw err;
			}
			else {    
				console.log("Success in createInterest");
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('interest',{"username":JSON.stringify(req.session.username), message: JSON.stringify("Interest created!! Add more interest to our list")});
			}
		}  
	});
}

exports.createInterest = createInterest;

function getInterestPage(req,res) {
	if(!req.session.username) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('main',  { message: 'Login Required', error: false});
	} else {
		console.log("In getIntPage");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('interest',{"username":JSON.stringify(req.session.username), message: JSON.stringify("Add interest to our list")});
	}
}

exports.getInterestPage = getInterestPage;