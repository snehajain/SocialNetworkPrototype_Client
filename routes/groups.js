var mq_client = require('../rpc/client');

function getGroups(req,res) {
	if(!req.session.username) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('main',  { message: 'Login Required', error: false});
	} else {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('groups',{"username":JSON.stringify(req.session.username)});
	}
}

exports.getGroups=getGroups;

function createGroup(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "groupname": req.param("groupData").groupname, "groupdesc": req.param("groupData").groupdesc, "members": req.param("groupData").members};
	if(!msg_payload.queryParams.members) {
		msg_payload.queryParams.members = [];
	}
	//msg_payload.queryParams.members.push({userid:req.session.userId, firstname:req.session.username, lastname:req.session.lastname });
	msg_payload.queryParams.creatorid = req.session.userId;
	msg_payload.queryParams.creatorname = req.session.username + " " +req.session.lastname;
	msg_payload.queryParams.create_time = (new Date()).toDateString();
	msg_payload.apiCall = "createGroup";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('groups_queue',msg_payload, function(err,results){
		
		console.log("results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==401) {
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('error', {message: "Error in createGroup"});	
			} else {
				console.log("groupId "+results.groupid);
				res.send('groups',{"groupId":results.groupid});
			}
		}  
	});	
}

exports.createGroup=createGroup;

function getGroupProfile(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "_id": req.param("groupId")};
	msg_payload.apiCall = "getGroupProfile";
	console.log("msg_payload.queryParams: " + msg_payload.queryParams);
	
	mq_client.make_request('groups_queue',msg_payload, function(err,results){
		
		console.log("results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==401) {
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('error', {message: "Error in createGroup"});	
			} else {
				if(!results.groupData) {
					res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render('groupProfile',{"username":JSON.stringify(req.session.username),"noGroup":true, "groupData":JSON.stringify(null), "memberData":JSON.stringify(null), "isMember": false, "isCreator": false});
				} else {
					console.log("getGroupProfile: "+JSON.stringify(results.groupData));
					var isCreator = false;
					var isMember = false;
					if(results.groupData.creatorid==req.session.userId) {
						isCreator=true;
						isMember=true;
					} else {
						for(var i=0; i<results.groupData.members.length; i++) {
							if(results.groupData.members[i].userid==req.session.userId) {
								isMember=true;
								break;
							}
						}
					}
					res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render('groupProfile',{"username":JSON.stringify(req.session.username),"groupData":JSON.stringify(results.groupData), "memberData":JSON.stringify(results.groupData.members), "isMember": isMember, "isCreator": isCreator, "noGroup":false});
				}
			}
		}  
	});	
}

exports.getGroupProfile=getGroupProfile;

function searchUser(req,res) {
	var msg_payload = {};
	msg_payload.queryParams = { "searchUser": "^"+req.param("userName"), "userid" : req.session.userId};
	msg_payload.apiCall = "searchUser";
	console.log("searchUser: " + msg_payload.queryParams);
	
	mq_client.make_request('groups_queue',msg_payload, function(err,results){
		
		console.log(" searchUser results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==401) {
				res.render('error', {message: "Error in createGroup"});	
			} else {
				res.send('/',{"userResults" : results.userData});
			}
		}  
	});	
}

exports.searchUser=searchUser;

function addMember(req,res) {
	var msg_payload = {};
	msg_payload.apiCall = "addMember";
	msg_payload.queryParams = { "groupid": req.param("group_id")};
	if(!req.param("member")) {
		var user = {userid:req.session.userId, firstname:req.session.username, lastname: req.session.lastname};
		msg_payload.queryParams.user = user;
	} else {
		msg_payload.queryParams.user = req.param("member");
	}
	console.log("searchUser: " + msg_payload.queryParams);
	
	mq_client.make_request('groups_queue',msg_payload, function(err,results){
		
		console.log(" searchUser results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==401) {
				res.render('error', {message: "Error in addMember"});	
			} else {
				res.send('/', {"username": req.session.username,"userLastname":req.session.lastname, "userid":req.session.userId});
			}
		}  
	});	
}

exports.addMember=addMember;

function deleteMember(req,res) {
	var msg_payload = {};
	msg_payload.apiCall = "deleteMember";
	msg_payload.queryParams = { "groupid": req.param("group_id")};
	if(!req.param("member_id")) {
		msg_payload.queryParams.userid = req.session.userId;
	} else {
		msg_payload.queryParams.userid = req.param("member_id");
	}
	console.log("deleteMember: " + msg_payload.queryParams);
	
	mq_client.make_request('groups_queue',msg_payload, function(err,results){
		
		console.log(" searchUser results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==401) {
				res.render('error', {message: "Error in addMember"});	
			} else {
				res.send('/');
			}
		}  
	});	
}

exports.deleteMember=deleteMember;

function updateGroup(req,res) {
	var msg_payload = {};
	msg_payload.apiCall = "updateGroup";
	msg_payload.queryParams = { "groupid": req.param("group_id"), "updatedData" : {groupname: req.param("groupName"), groupdesc: req.param("groupDesc")}};
	console.log("updateGroup: " + msg_payload.queryParams);
	
	mq_client.make_request('groups_queue',msg_payload, function(err,results){
		
		console.log(" updateGroup results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==401) {
				res.render('error', {message: "Error in addMember"});	
			} else {
				res.send('/');
			}
		}  
	});	
}

exports.updateGroup=updateGroup;

function deleteGroup(req,res) {
	var msg_payload = {};
	msg_payload.apiCall = "deleteGroup";
	msg_payload.queryParams = { groupid: req.param("group_id")};
	console.log("deleteGroup: " + msg_payload.queryParams);
	
	mq_client.make_request('groups_queue',msg_payload, function(err,results){
		
		console.log(" deleteGroup results" + results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==401) {
				res.render('error', {message: "Error in addMember"});	
			} else {
				res.send('/');
			}
		}  
	});	
}

exports.deleteGroup=deleteGroup;

function getMyGroups(req,res) {
	var msg_payload = {};
	msg_payload.apiCall = "getMyGroups";
	msg_payload.queryParams = { userid: req.session.userId};
	console.log("getMyGroups: " + msg_payload.queryParams);
	
	mq_client.make_request('groups_queue',msg_payload, function(err,results){
		
		console.log(" getMyGroups results" + JSON.stringify(results.friendGroupList));
		if(err){
			throw err;
		}
		else 
		{
			if(results.code==401) {
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('error', {message: "Error in addMember"});	
			} else {
				res.send('/groups', {"myGroups":results.myGroups,"otherGroups":results.otherGroups, "friendGroupList": results.friendGroupList});
			}
		}  
	});	
}

exports.getMyGroups=getMyGroups;