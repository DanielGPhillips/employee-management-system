var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(function(err) {
  if (err) throw err;
});

module.exports = connection;