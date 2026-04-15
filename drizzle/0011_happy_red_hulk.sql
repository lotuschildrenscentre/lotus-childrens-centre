CREATE TABLE `media_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('photo','video') NOT NULL DEFAULT 'photo',
	`title` varchar(500),
	`titleMn` varchar(500),
	`description` text,
	`descriptionMn` text,
	`url` text NOT NULL,
	`thumbnailUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_items_id` PRIMARY KEY(`id`)
);
