module.exports = function (app, query) {
  app.post("/playback_data", async (req, res) => {
    let sql = async function () {
      try {
        let data = `INSERT INTO playback_data (video_id, buffering_bitrate_audio, buffering_bitrate_video, buffering_state, buffering_vmaf, duration, framerate, player_state, playing_bitrate_video, playing_bitrate_audio, playing_vmaf, position, rendering_state, resolution, segment_position, timestamp, total_corrupted_frames, total_dropped_frames, total_frames, volume) VALUES (${req.body.video_id}, '${req.body.playback_data.buffering_bitrate_audio}', '${req.body.playback_data.buffering_bitrate_video}', '${req.body.playback_data.buffering_state}', '${req.body.playback_data.buffering_vmaf}', '${req.body.playback_data.duration}', '${req.body.playback_data.framerate}', '${req.body.playback_data.player_state}', '${req.body.playback_data.playing_bitrate_video}', '${req.body.playback_data.playing_bitrate_audio}', '${req.body.playback_data.playing_vmaf}', '${req.body.playback_data.position}', '${req.body.playback_data.rendering_state}', '${req.body.playback_data.resolution}', '${req.body.playback_data.segment_position}', '${req.body.playback_data.timestamp}', '${req.body.playback_data.total_corrupted_frames}', '${req.body.playback_data.total_dropped_frames}', '${req.body.playback_data.total_frames}', '${req.body.playback_data.volume}')`;

        await query(data);

        data = `INSERT INTO archive (video_id, data, timestamp) VALUES (${req.body.video_id}, '${req.body.archive.data}', '${req.body.archive.timestamp}')`;

        await query(data);
      } finally {
      }
    };

    sql().then(() => {
      res.status(201).json({ msg: "OK" });
    });
  });
};
