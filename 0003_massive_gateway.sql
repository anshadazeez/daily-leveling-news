CREATE TABLE `bookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`articleId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `readingHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`articleId` int NOT NULL,
	`readAt` timestamp NOT NULL DEFAULT (now()),
	`timeSpentSeconds` int,
	`completed` boolean DEFAULT false,
	CONSTRAINT `readingHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trendingArticles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`categoryId` int NOT NULL,
	`score` decimal(10,2),
	`calculatedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `trendingArticles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`followedCategories` text,
	`theme` enum('light','dark','auto') NOT NULL DEFAULT 'auto',
	`fontSize` enum('small','medium','large') NOT NULL DEFAULT 'medium',
	`emailNotifications` boolean DEFAULT true,
	`notificationFrequency` enum('instant','daily','weekly') NOT NULL DEFAULT 'daily',
	`showImages` boolean DEFAULT true,
	`compactView` boolean DEFAULT false,
	`trackReadingHistory` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `userPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `categories` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` MODIFY COLUMN `slug` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `newsSources` MODIFY COLUMN `sourceType` enum('rss','api','scrape') NOT NULL DEFAULT 'rss';--> statement-breakpoint
ALTER TABLE `articles` ADD `content` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `imageUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `articles` ADD `author` varchar(255);--> statement-breakpoint
ALTER TABLE `articles` ADD `readingTimeMinutes` int;--> statement-breakpoint
ALTER TABLE `articles` ADD `viewCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `articles` ADD `isPopular` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `articles` ADD `isTrending` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `articles` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `categories` ADD `icon` varchar(50);--> statement-breakpoint
ALTER TABLE `categories` ADD `color` varchar(20);--> statement-breakpoint
ALTER TABLE `categories` ADD `priority` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `categories` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `dailyDigests` ADD `rank` int;--> statement-breakpoint
ALTER TABLE `newsSources` ADD `apiKey` varchar(500);--> statement-breakpoint
ALTER TABLE `newsSources` ADD `logo` varchar(500);--> statement-breakpoint
ALTER TABLE `newsSources` ADD `description` text;