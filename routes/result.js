module.exports = function (app, query) {
  app.get("/results",
      async (req, res) => {
        //Get video info +  playback data + assessments + bitrate changes

        let result = async function () {
          let userCourse = [];
          try {
            const experiments = await query("select * from experiment");

            for (const item of experiments) {
              const user = {
                id: item.id,
                started: item.started,
                ended: item.ended,
                video_limit: item.video_limit,
                subject_id: item.subject_id,
                settings: item.settings,
                urls: item.urls,
                video: [],
              };

              const videos = await query(
                  `select * from video where experiment_id=${item.id}`
              );

              for (let j = 0; j < videos.length; j++) {
                let all_data = videos[j];

                all_data.playback_data = await query(
                    `select * from playback_data where video_id=${videos[j].id}`
                );

                user.video.push(all_data);
              }

              userCourse.push(user);

              return userCourse
            }
          } catch (e) {
            console.log(e)
          }
        };

        result().then((value) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(value, null, 3));
        });
      });
};
