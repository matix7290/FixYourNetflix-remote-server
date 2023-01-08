BEGIN;
CREATE TABLE IF NOT EXISTS `experiment` (
	`id`	INT(255) NOT NULL,
	`started`	VARCHAR(255) NOT NULL,
	`ended`	VARCHAR(255) DEFAULT,
	`video_limit`	INT(255) NOT NULL,
	`subject_id`	VARCHAR(255) NOT NULL,
	`settings`	VARCHAR(255) NOT NULL,
	`urls`	VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `video` (
	`id`	INT(255) NOT NULL,
	`started`	VARCHAR(255) NOT NULL,
	`ended`	VARCHAR(255) DEFAULT NULL,
	`experiment_id`	INT(255) NOT NULL,
	`url`	VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`experiment_id`) REFERENCES `experiment`(`id`)
);
CREATE TABLE IF NOT EXISTS `archive` (
	`id`	INT(255) NOT NULL,
	`video_id`	INT(255) NOT NULL,
	`data`	VARCHAR(255) NOT NULL,
	`timestamp`	VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`video_id`) REFERENCES `video`(`id`)
);
CREATE TABLE IF NOT EXISTS `event` (
	`id`	INT(255) NOT NULL,
	`video_id`	INT(255) NOT NULL,
	`type`	VARCHAR(255) NOT NULL,
	`payload`	VARCHAR(255) DEFAULT NULL,
	`timestamp`	VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`video_id`) REFERENCES `video`(`id`)
);
CREATE TABLE IF NOT EXISTS `playback_data` (
	`id`	INT(255) NOT NULL,
	`video_id`	INT(255) NOT NULL,
	`buffering_bitrate_audio`	VARCHAR(255),
	`buffering_bitrate_video`	VARCHAR(255),
	`buffering_state`	VARCHAR(255),
	`buffering_vmaf`	VARCHAR(255),
	`duration`	VARCHAR(255),
	`framerate`	VARCHAR(255),
	`player_state`	VARCHAR(255),
	`playing_bitrate_video`	VARCHAR(255),
	`playing_bitrate_audio`	VARCHAR(255),
	`playing_vmaf`	VARCHAR(255),
	`position`	VARCHAR(255),
	`rendering_state`	VARCHAR(255),
	`resolution`	VARCHAR(255),
	`segment_position`	VARCHAR(255),
	`timestamp`	VARCHAR(255),
	`total_corrupted_frames`	VARCHAR(255),
	`total_dropped_frames`	VARCHAR(255),
	`total_frames`	VARCHAR(255),
	`volume`	VARCHAR(255),
	PRIMARY KEY(`id`),
	FOREIGN KEY(`video_id`) REFERENCES `video`(`id`)
);
COMMIT;
