CREATE TABLE `daily_tips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriptionId` int NOT NULL,
	`dayNumber` int NOT NULL,
	`category` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`actionOfDay` text NOT NULL,
	`reflection` text NOT NULL,
	`motivation` text NOT NULL,
	`sentAt` timestamp,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_tips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriptionId` int NOT NULL,
	`dayNumber` int NOT NULL,
	`situationUpdate` text NOT NULL,
	`emotionalState` enum('melhorando','estavel','piorando') NOT NULL,
	`actionsTaken` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `resultLevel` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `canceledAt` timestamp;--> statement-breakpoint
ALTER TABLE `daily_tips` ADD CONSTRAINT `daily_tips_subscriptionId_subscriptions_id_fk` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_progress` ADD CONSTRAINT `user_progress_subscriptionId_subscriptions_id_fk` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions`(`id`) ON DELETE no action ON UPDATE no action;