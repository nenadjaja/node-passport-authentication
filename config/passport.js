var LocalStrategy = require('passport-local').Strategy;
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/passport";

var client = new pg.Client(connectionString);

var User = require('../models/user');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.user_id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // define the local-signup strategy
  passport.use('local-signup', new LocalStrategy({usernameField : 'email', passReqToCallback: true}, 
    function(req, email, password, done) {
      process.nextTick(function() {
        // if user is not logged in
        if (!req.user) {
          User.findByEmail(email, function(err, user) {
            if (err) { 
              return done(err);
            }
            if (user.rows) {   // if the user already exist
              return done(null, false, req.flash('signupMessage', 'This email is already taken.'));
            } else  { // create a new user
              user = new User();
              user.email = req.body.email;
              user.password = req.body.password;
              user.save(function(newUser) {
                passport.authenticate();
                return done(null, newUser);
              });
            }
          });
        } else {
            return done(null, req.user);
        }
      });
    })
  );
};
