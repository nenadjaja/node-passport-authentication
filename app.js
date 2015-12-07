var express = require('express');
var app = express();
var path = require('path');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var pg = require('pg');
var morgan = require('morgan');

require('./config/passport')(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use('/public', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// session stuff
app.use(session({ secret: 'nenanerdettanenanerdetta', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());		
app.use(flash());

// check if postgres is working
// var connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/passport";
// var client = new pg.Client(connectionString);

// client.connect(function(err, client, done) {
// 	if (err) {
// 		console.error("Can't connect to postgres", err);
// 		return;
// 	} 
// });

// define routes
app.get('/', function(req, res) {
	res.render('index');
});
	
app.get('/dashboard', isLoggedIn, function(req, res) {
	res.render('dashboard', {user: req.user});
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/signup', function(req, res) {
	res.render('signup', { message: req.flash('signupMessage') });
});

app.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/dashboard',
	failureRedirect: '/signup',
	failureFlash: true
}));


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

app.listen(8010);