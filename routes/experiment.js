module.exports = function (app, query) {
  app.post("/experiment", async (req, res) => {
    let sql = async function () {
      try {
        var data = `
            INSERT INTO experiment (id, started, video_limit, subject_age, subject_sex, subject_netflix_familiarity, subject_selected_content, content_continuation, settings, urls)
            VALUES (${req.body.id}, '${req.body.started}', ${
          req.body.video_limit
        }, ${req.body.subject_age}, '${req.body.subject_sex}', '${
          req.body.subject_netflix_familiarity ? 1 : 0
        }', '${req.body.subject_selected_content ? 1 : 0}', '${
          req.body.content_continuation ? 1 : 0
        }', '${req.body.settings}', '${req.body.urls}')
            `;

        console.log(1, req.body.subject_sex);
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
          "SELECT IFNULL(MAX((id)+1), 1) as next_id FROM experiment"
        );

        userCourse = rows[0].next_id;
      } finally {
        return userCourse;
      }
    };

    result().then((value) => {
      res.status(200).send({ next_id: value });
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
