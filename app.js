// const { response } = require('express')
const express = require("express");
const util = require("util");
const mysql = require("mysql");

const app = express();
const port = 5001;

const conn = mysql.createConnection({
  host: "mysql.agh.edu.pl",
  user: "mbolszew",
  password: "L4DPUVJK0mzrKUbv",
  database: "mbolszew",
});

const query = util.promisify(conn.query).bind(conn);

app.use(express.json());

require("./routes/bitrate")(app, query);
require("./routes/event")(app, query);
require("./routes/experiment")(app, query);
require("./routes/playback_data")(app, query);
require("./routes/resoult")(app, query);
require("./routes/video")(app, query);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
