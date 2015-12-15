var ejs = require("ejs");
var mq_client = require('../rpc/client');

function getUserPosts(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId};
	msg_payload.apiCall = "getUserPosts";
	console.log("msg_payload.queryParams: " +msg_payload.queryParams);
	
	mq_client.make_request('post_queue',msg_payload, function(err,results){
		
		console.log("results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in get Post");
				res.render('error', {message: "Error in getPost"});
			}
			else {    
				console.log("Success in GetPost--" + results.posts);
				res.send('', {userPosts: results.posts});
				
			}
		}  
	});
	
}

exports.getUserPosts = getUserPosts;


function createPost(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId, "postContent": req.param("postContent"), "createTime" : new Date(), "creatorname": req.session.username+ " " + req.session.lastname};
	msg_payload.queryParams.postContent = msg_payload.queryParams.postContent.replace("\n", "<br />");
	msg_payload.apiCall = "createPost";
	console.log("msg_payload.queryParams: " +msg_payload.queryParams);
	
	mq_client.make_request('post_queue',msg_payload, function(err,results){
		
		console.log("results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Invalid CreatePost");
				res.render('error', {message: "Error in getNewsFeed"});
			}
			else {    
				console.log("valid createPost");
				res.send('/');
				
			}
		}  
	});
	
}

exports.createPost = createPost;

function getNewsFeedPage(req,res){
	if(req.session.username) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('userNewsFeed', { "username" : JSON.stringify(req.session.username)});
	} else {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('main',  { message: 'Login Required', error: false});	
	}
}

exports.getNewsFeedPage = getNewsFeedPage;

function getNewsFeed(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.session.userId};
	msg_payload.apiCall = "getNewsFeed";
	
	mq_client.make_request('post_queue',msg_payload, function(err,results){
		
		console.log("results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in get Post");
				res.render('error', {message: "Error in getNewsFeed"});
			}
			else {    
				console.log("Success in GetPost--" + results.posts);
				res.send('/', {"newsFeed" : results.newsFeed});
				
			}
		}  
	});
}

exports.getNewsFeed = getNewsFeed;

function getFriendPosts(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "userid": req.param("friendId")};
	msg_payload.apiCall = "getFriendPosts";
	
	mq_client.make_request('post_queue',msg_payload, function(err,results){
		
		//console.log("results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Error in get Post");
				res.render('error', {message: "Error in getNewsFeed"});
			}
			else {    
				console.log("Success in GetFriendsPost--" + results.posts);
				res.send('/', {"userPosts" : results.posts});
				
			}
		}  
	});
}

exports.getFriendPosts = getFriendPosts;