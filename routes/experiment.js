module.exports = function (app, query) {
  app.post("/experiment", async (req, res) => {
    //Create experiment

    let sql = async function () {
      try {
        var data = `
            INSERT INTO experiment (id, started, video_limit, subject_age, subject_sex, settings, urls)
            VALUES (${req.body.id}, '${req.body.started}', ${req.body.video_limit}, ${req.body.subject_age}, '${req.body.subject_sex}', '${req.body.settings}', '${req.body.urls}')
            `;
        await query(data);
      } finally {
      }
    };

    sql().then(() => {
      res.status(201).json({ msg: "Experiment end time updated" });
    });
  });

  app.patch("/experiment", async (req, res) => {
    let sql = async function () {
      try {
        var data = `
            UPDATE experiment SET ended=${req.body.ended} WHERE id=${req.body.experiment_id}
            `;
        await query(data);
      } finally {
      }
    };

    sql().then(() => {
      res.status(201).json({ msg: "Experiment created" });
    });
  });

  app.get("/experiment/next_id", async (req, res) => {
    let result = async function () {
      var userCourse = [];
      try {
        const rows = await query(
          "select id from experiment order by id desc limit 1"
        );

        console.log(rows.length);

        if (rows.length == 0) {
          userCourse = 1;
        } else {
          userCourse = rows[0].id + 1;
        }
      } finally {
        return userCourse;
      }
    };

    result().then((value) => {
      res.status(200).send({ next_id: 1 });
    });
  });

  app.get("/experiment", async (req, res) => {
    let result = async function () {
      var userCourse = [];
      try {
        const rows = await query("select * from experiment");
        userCourse = rows;
      } finally {
        return userCourse;
      }
    };

    result().then((value) => {
      res.send(value);
    });
  });
};
