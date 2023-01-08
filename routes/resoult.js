module.exports = function (app, query) {
  app.get("/results", async (req, res) => {
    //Get video info +  playback data + assessments + bitrate changes

    let result = async function () {
      var userCourse = [];
      try {
        const experiments = await query("select * from experiment");

        for (let i = 0; i < experiments.length; i++) {
          var user = {
            id: experiments[i].id,
            started: experiments[i].started,
            ended: experiments[i].ended,
            video_limit: experiments[i].video_limit,
            subject_id: experiments[i].subject_id,
            settings: experiments[i].settings,
            urls: experiments[i].urls,
            video: [],
          };

          const videos = await query(
            `select * from video where experiment_id=${experiments[i].id}`
          );

          for (let j = 0; j < videos.length; j++) {
            var all_data = videos[j];

            const playback_data = await query(
              `select * from playback_data where video_id=${videos[j].id}`
            );

            all_data.playback_data = playback_data;

            user.video.push(all_data);
          }

          userCourse.push(user);
        }
      } finally {
        return userCourse;
      }
    };

    result().then((value) => {
      res.send(value);
    });
  });
};
