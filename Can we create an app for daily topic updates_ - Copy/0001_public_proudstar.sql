CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`url` varchar(500) NOT NULL,
	`sourceId` int NOT NULL,
	`categoryId` int NOT NULL,
	`gist` text,
	`whyItMatters` text,
	`keyTakeaway` text,
	`publishedAt` timestamp,
	`fetchedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_url_unique` UNIQUE(`url`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` varchar(50) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `dailyDigests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`digestDate` timestamp NOT NULL,
	`articleId` int NOT NULL,
	`categoryId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyDigests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsSources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` varchar(500) NOT NULL,
	`categoryId` int NOT NULL,
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`sourceType` enum('rss','api') NOT NULL DEFAULT 'rss',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsSources_id` PRIMARY KEY(`id`)
);
