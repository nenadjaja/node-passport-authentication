var pg = require('pg');

var connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/passport";

var User = function() {
	this.user_id = 0;
	this.email = '';
	this.password = '';

	this.save = function(callback) {
		var client = new pg.Client(connectionString);
		client.connect();
		// run the insert query to save the user
		client.query('INSERT INTO users(email, password) VALUES($1, $2)', [this.email, this.password], function(err, result) {
			if (err) return console.error(err);
		});

		client.query('SELECT * FROM users ORDER BY user_id desc limit 1', null, function(err, result) {
			if (err) return callback(null);	
			if (result.rows.length !== 0) {
				var newUser = createUser(result.rows[0]);
				client.end();
				return callback(newUser);
			}
		});
	};
};

User.findByEmail = function(email, callback) {
	var client = new pg.Client(connectionString);
	client.connect();

	client.query('SELECT * FROM users WHERE email=$1', [email], function(err, result) {
		if (err) return callback(err, this);
		client.end();
		return callback(false, this);
	});
};

User.findById = function(id, callback) {
  var client = new pg.Client(connectionString);
	client.connect();
	// run the select query
	client.query("SELECT * from users where user_id=$1", [id], function(err, result) {
		if (err) return callback(err, null);
		if (result.rows.length !== 0) {
			var newUser = createUser(result.rows[0]);
			client.end();
			return callback(null, newUser);
		}
	});
};

// helper: return new user
function createUser(user) {
	var newUser = new User();
	newUser.user_id = user.user_id;
	newUser.email = user.email;
	newUser.password = user.password;
	return newUser;
}

module.exports = User;