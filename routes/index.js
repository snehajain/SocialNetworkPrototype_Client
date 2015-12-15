
/*
 * GET home page.
 */

exports.index = function(req, res){
	if(req.session.userId) {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('welcomePage', { "username" : JSON.stringify(req.session.username)});
	} else {
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('main', { header: 'login', error: false, message: "Please enter your login credentials", emailError:false});
	}
};