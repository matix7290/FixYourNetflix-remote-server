/*DROP TABLES*/
DROP TABLE IF EXISTS playback_data;
DROP TABLE IF EXISTS archive;
DROP TABLE IF EXISTS `event`;
DROP TABLE IF EXISTS video;
DROP TABLE IF EXISTS experiment;


CREATE TABLE IF NOT EXISTS experiment(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    started TEXT NOT NULL,
    ended TEXT DEFAULT NULL,
            
    video_limit INTEGER NOT NULL,
    subject_age INTEGER NOT NULL,
    subject_sex TEXT NOT NULL,

    subject_selected_content BOOLEAN NOT NULL,
    subject_netflix_familiarity BOOLEAN NOT NULL,
    content_continuation BOOLEAN NOT NULL, 
    
    settings TEXT NOT NULL,
    urls TEXT NOT NULL        
);

CREATE TABLE IF NOT EXISTS video(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    started TEXT NOT NULL,  
    ended TEXT DEFAULT NULL,    
    experiment_id INTEGER NOT NULL,
    url TEXT NOT NULL,

    FOREIGN KEY(experiment_id) REFERENCES experiment(id)
);

CREATE TABLE IF NOT EXISTS playback_data(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    video_id INTEGER NOT NULL,

    buffering_bitrate_audio TEXT,
    buffering_bitrate_video TEXT,
    buffering_state TEXT,
    buffering_vmaf TEXT,
    duration TEXT,
    framerate TEXT,
    player_state TEXT,
    playing_bitrate_video TEXT,
    playing_bitrate_audio TEXT,
    playing_vmaf TEXT,
    position TEXT,
    rendering_state TEXT,
    resolution TEXT,
    segment_position TEXT,
    timestamp TEXT,
    total_corrupted_frames TEXT,
    total_dropped_frames TEXT,
    total_frames TEXT,
    volume TEXT,

    FOREIGN KEY(video_id) REFERENCES video(id)
);

CREATE TABLE IF NOT EXISTS archive(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    video_id INTEGER NOT NULL,

    data TEXT NOT NULL,
    timestamp TEXT NOT NULL,

    FOREIGN KEY(video_id) REFERENCES video(id)
);

CREATE TABLE IF NOT EXISTS event(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    video_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    payload TEXT DEFAULT NULL,
    timestamp TEXT NOT NULL,

    FOREIGN KEY(video_id) REFERENCES video(id)
)