const express = require("express");
const util = require("util");
const mysql = require("mysql");
const cors = require("cors");
var path = require("path");

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

const allowedOrigins = [
  "https://tufiqoe-fyn-remote-server.herokuapp.com",
  "http://mbolszewski.ddns.net:2135",
  "http://mbolszewski.ddns.net:2136",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

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
  console.log(`App listening on port ${port}`);
});
