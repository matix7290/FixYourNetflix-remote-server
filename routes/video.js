module.exports = function (app, query) {
  app.post("/video", function (req, res) {
    let sql = async function () {
      let userCourse = [];

      try {
        const data = `
            INSERT INTO video (started, experiment_id, url)
            VALUES ('${req.body.started}', ${req.body.experiment_id}, '${req.body.url}')
            `;
        await query(data);
        const rows = await query(
          "select id from video order by id desc limit 1"
        );
        userCourse = rows[0].id;

        return userCourse
      } catch (e) {
        console.log(e)
      }
    };

    sql().then((value) => {
      res.status(201).json({ video_id: value });
    });
  });

  app.patch("/video", function (req, res) {
    let sql = async function () {
      try {
        const data = `
            UPDATE video SET ended='${req.body.ended}' WHERE video.id=${req.body.video_id}
            `;
        await query(data);
      } finally {
      }
    };

    sql().then(() => {
      res.status(201).json({ msg: "Video updated" });
    });
  });
};
