module.exports = function (app, query) {
  app.post("/bitrate", async (req, res) => {
    let sql = async function () {
      try {
        var data = `INSERT INTO bitrate (video_id, value, previous, timestamp) VALUES (${req.body.video_id}, ${req.body.value}, ${req.body.previous}, '${req.body.timestamp}')
            `;
        await query(data);
      } finally {
      }
    };

    sql().then(() => {
      res.status(201).json({ msg: "Birtate change created" });
    });
  });
};
