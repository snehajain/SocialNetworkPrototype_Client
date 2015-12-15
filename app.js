var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , login = require('./routes/login')
  , path = require('path');
var mongo = require("./routes/mongodb");

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

var mq_client = require('./rpc/client');

var posts = require('./routes/posts');
var friends = require('./routes/friends');
var user = require('./routes/user');
var interests = require('./routes/interests');
var events = require('./routes/events');
var search = require('./routes/search');
var groups = require('./routes/groups');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(express.cookieParser());

app.use(session({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new MongoStore({
		url: mongoSessionConnectURL
	})
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function restrict(req, res, next) {
	  if (req.session.userId) {
	    next();
	  } else {
		res.render('main', { header: 'LoginRequired', error: false, message: "To view this content you must sign-in", emailError:false});
	  }
	}

app.get('/', routes.index);
app.post('/login', login.validateLogin);
//app.get('/signup',login.signup);
app.get('/login', login.getLogin);
app.post('/signup', login.createUser);
app.get('/getUserPosts',restrict, posts.getUserPosts);
app.get('/getUserFriends',restrict, friends.getUserFriends);
app.get('/getUserAbout',restrict, user.getUserAbout);
app.get('/getUserInterests',restrict,interests.getUserInterests);
app.post('/createPost',restrict,posts.createPost);
app.put('/editAbout', restrict,user.editAbout);
app.put('/unfriendUser',restrict,friends.unfriendUser);
app.get('/userNewsFeed',restrict,posts.getNewsFeedPage);
app.get('/getNewsFeed', restrict,posts.getNewsFeed);
app.put('/removeInterest', restrict,interests.removeInterest);
app.get('/searchInterest', restrict,interests.searchInterest);
app.post('/addInterest', restrict,interests.addInterest);
app.post('/addEvent', restrict,events.addEvent);
app.get('/searchQuery',restrict, search.searchRequest);
app.get('/getUserProfile',restrict, friends.getUserProfile);
app.get('/getFriendName',restrict, friends.getFriendName);
app.get('/getFriendPosts',restrict, posts.getFriendPosts);
app.get('/getFriendAbout',restrict, friends.getFriendAbout);
app.get('/getFriendFriends',restrict, friends.getFriendFriends);
app.get('/getFriendInterests',restrict, friends.getFriendInterests);
app.get('/getFriendRequestStatus',restrict, friends.getFriendRequestStatus);
app.post('/acceptRequest',restrict, friends.acceptRequest);
app.post('/declineRequest',restrict, friends.declineRequest);
app.post('/addAsFriend',restrict, friends.addAsFriend);
app.post('/cancelRequest',restrict, friends.cancelRequest);
app.get('/createInterest', restrict, interests.getInterestPage);
app.post('/createInterest', restrict, interests.createInterest);
app.get('/groups',restrict, groups.getGroups);
app.post('/createGroup',restrict, groups.createGroup);
app.get('/groupProfile',restrict, groups.getGroupProfile);
app.get('/searchUser',restrict, groups.searchUser);
app.post('/addMember',restrict, groups.addMember);
app.put('/leaveGroup', restrict, groups.deleteMember);
app.put('/updateGroup', restrict, groups.updateGroup);
app.put('/deleteGroup',restrict, groups.deleteGroup);
app.get('/getMyGroups',restrict, groups.getMyGroups);
app.get('/getAbout', function(req, res){
	if(req.session.userId) {
		res.render('about', {username:req.session.username, loggedIn:true});
	} else {
		res.render('about', {username:'Prospective User', loggedIn:false});
	}
	
});
app.get('/logout', function(req, res){
	req.session.destroy();
	res.render('main',  { header: 'Signout', message: 'Thanks for stopping by', error:false, emailError:false});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log(res.toString());
	console.log(req.toString());
	var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
	  app.use(function(err, req, res, next) {
	    //res.status(err.status || 500);
	    res.render('error', {
	      message: err.message,
	      error: err
	    });
	  });
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.render('error', {
	    message: err.message,
	    error: {}
	  });
	});

//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});
