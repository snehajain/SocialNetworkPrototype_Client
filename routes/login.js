var ejs = require("ejs");
var mq_client = require('../rpc/client');
var hashFunction = require('./hashFunction');

function signup(req,res) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('signup', {error:false});
}

function createUser(req,res)
{
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	//var password = req.param("password");
	var sex = req.param("sex");
	var email = req.param("email");
	var msg_payload = {}; 
	var password = hashFunction.hash(req.param('password'), req.param('email'));
	msg_payload.queryParams={ "firstname": firstname, "password": password, "lastname": lastname, "sex": sex, "email":email };
		
	console.log("In POST Request = Username:"+ firstname+" "+password);
	
	mq_client.make_request('signup_queue',msg_payload, function(err,results){
		console.log("In response of sgnup"+JSON.stringify(results));
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401) {
				console.log("Error in getUserFriends");
				res.render('error', {message: "Error in getUserFriends"});
			}
			 if(results.emailExists==true) {
				 res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				 res.render('main', { header: 'login', error: false, message: "Please enter your login credentials", emailError:true});
			} else {
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('main', { header: 'login', error: false, message: "Signup completed. Please enter your login credentials", emailError:false});
			}
		}  
	});
	
}


function validateLogin(req,res) {
	var email = req.param("username");
	//var password = req.param("password");
	var password = hashFunction.hash(req.param('password'), req.param('username'));
	var msg_payload = {}; 
	msg_payload.queryParams={ "email": email, "password": password };
	console.log("In POST Request = UserName:"+ email+" "+password);
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log("results--" + results.username);
		console.log("Some change");
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 401){
				console.log("Invalid Login");
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('main', { header: 'login', error: true, message: " ", emailError:false});
			}
			else {    
				console.log("valid Login");
				req.session.username = results.username;
				req.session.lastname = results.lastname;
				req.session.userId = results.userId;
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render('welcomePage', {username:JSON.stringify(results.username)});
				
			}
		}  
	});
	
}

function getLogin(req, res) {
	if(req.session.userId) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('welcomePage', { "username" : JSON.stringify(req.session.username)});	
	} else {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('main', { header: 'login', error: false, message: "Please enter your login credentials", emailError:false});
	}
}

exports.getLogin = getLogin;

exports.validateLogin = validateLogin;
exports.signup=signup;
exports.createUser=createUser;