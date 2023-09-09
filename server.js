const express = require("express");
const util = require("util");
const mysql = require("mysql");
const path = require("path");

const app = express();
const port = process.env.PORT || 5001;

const conn = mysql.createConnection({
  host: "mbolszewski.ddns.net",
  port: 2136,
  user: "netflix",
  password: "netflix-db-conn-2137",
  database: "netflix",
});

const query = util.promisify(conn.query).bind(conn);

app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", 1);
  next();
});

require(path.join(__dirname + "/routes/bitrate"))(app, query);
require(path.join(__dirname + "/routes/event"))(app, query);
require(path.join(__dirname + "/routes/experiment"))(app, query);
require(path.join(__dirname + "/routes/playback_data"))(app, query);
require(path.join(__dirname + "/routes/result"))(app, query);
require(path.join(__dirname + "/routes/video"))(app, query);

app.get("/", (req, res) => {
  res.send(`App listening on port ${port}`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
