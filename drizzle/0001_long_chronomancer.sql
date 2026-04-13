CREATE TABLE `page_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageKey` varchar(64) NOT NULL,
	`sectionKey` varchar(128) NOT NULL,
	`title` text,
	`content` text,
	`metadata` json,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `page_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`duration` varchar(255) NOT NULL,
	`quote` text NOT NULL,
	`isPublished` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `volunteer_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`dateOfBirth` varchar(64),
	`nationality` varchar(128),
	`languages` text,
	`intendedDates` varchar(255),
	`howHelp` text,
	`experience` text,
	`whyVolunteer` text,
	`criminalRecord` varchar(255),
	`convictions` varchar(255),
	`codeOfConduct` varchar(255),
	`hearAbout` varchar(255),
	`status` enum('pending','reviewed','approved','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `volunteer_submissions_id` PRIMARY KEY(`id`)
);
