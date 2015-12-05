var express = require('express');
var app = express();
var path = require('path');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser());

// session stuff
app.use(session({ secret: 'nenanerdettanenanerdetta'}));
app.use(passport.initialize());
app.use(passport.session());		
app.use(flash());

// define routes
app.get('/', function(req, res) {
	res.render('index');
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/signup', function(req, res) {
	res.render('signup', { message: req.flash('signupMessage') });
});

app.listen(8010);