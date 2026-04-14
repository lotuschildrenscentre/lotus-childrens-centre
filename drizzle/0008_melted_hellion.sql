CREATE TABLE `volunteer_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`data` json NOT NULL,
	`status` enum('pending','reviewed','approved','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `volunteer_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `volunteer_form_fields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fieldKey` varchar(128) NOT NULL,
	`fieldType` enum('text','email','textarea','select','date','tel') NOT NULL DEFAULT 'text',
	`label` varchar(512) NOT NULL,
	`placeholder` varchar(512),
	`labelMn` varchar(512),
	`placeholderMn` varchar(512),
	`options` json,
	`isRequired` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `volunteer_form_fields_id` PRIMARY KEY(`id`),
	CONSTRAINT `volunteer_form_fields_fieldKey_unique` UNIQUE(`fieldKey`)
);
