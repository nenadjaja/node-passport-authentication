var pg = require('pg');
var connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/passport";

var client = new pg.Client(connectionString);
client.connect();

var createQuery = client.query('CREATE TABLE users(user_id SERIAL PRIMARY KEY unique, email VARCHAR(100), password VARCHAR(100))');

// assure uniqueness
// var createQuery = client.query('CREATE unique index on users(user_id)');

createQuery.on('end', function() {
	client.end();
});
