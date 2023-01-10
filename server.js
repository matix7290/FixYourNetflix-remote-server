const express = require("express");
const util = require("util");
const mysql = require("mysql");
var path = require("path");

const app = express();
const port = process.env.PORT || 5001;

const conn = mysql.createConnection({
  host: "mysql.agh.edu.pl",
  port: 3306,
  user: "mbolszew",
  password: "L4DPUVJK0mzrKUbv",
  database: "mbolszew",
});

const query = util.promisify(conn.query).bind(conn);

app.use(express.json());

require(path.join(__dirname + "/routes/bitrate"))(app, query);
require(path.join(__dirname + "/routes/event"))(app, query);
require(path.join(__dirname + "/routes/experiment"))(app, query);
require(path.join(__dirname + "/routes/playback_data"))(app, query);
require(path.join(__dirname + "/routes/resoult"))(app, query);
require(path.join(__dirname + "/routes/video"))(app, query);

app.get("/", (req, res) => {
  res.send(`App listening on port ${port}`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`, conn.state);
});
