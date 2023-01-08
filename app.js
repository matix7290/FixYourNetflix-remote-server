// const { response } = require('express')
const express = require("express");
const util = require("util");
const mysql = require("mysql");

const app = express();
const port = 5001;

const conn = mysql.createConnection({
  host: "localhost",
  user: "netflix",
  password: "netflix-db-conn-2137",
  database: "netflix",
});

const query = util.promisify(conn.query).bind(conn);

require("./routes/bitrate")(app, query);
require("./routes/event")(app, query);
require("./routes/experiment")(app, query);
require("./routes/playback_data")(app, query);
require("./routes/resoult")(app, query);
require("./routes/video")(app, query);

app.use(express.json());

app.get("/", (req, res) => {
  res.json(JSON.stringify(requests));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
