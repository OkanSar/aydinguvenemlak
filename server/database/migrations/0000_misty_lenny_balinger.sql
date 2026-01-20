CREATE TABLE `advertisement_views` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`advertId` integer NOT NULL,
	`ip` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `advertisements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`detailDescription` text NOT NULL,
	`image` text NOT NULL,
	`price` integer NOT NULL,
	`city` text NOT NULL,
	`district` text NOT NULL,
	`neighborhood` text,
	`type` text NOT NULL,
	`advertType` integer NOT NULL,
	`status` integer NOT NULL,
	`advertNo` integer NOT NULL,
	`fromSale` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`phoneNumber` text NOT NULL,
	`islandNo` integer,
	`parcelNo` integer,
	`metreSquare` integer,
	`metreSquarePrice` integer,
	`zoningStatus` text,
	`titleDeedStatus` text,
	`apartMetreSquareGross` integer,
	`apartMetreSquareNet` integer,
	`roomNumber` text,
	`heatingType` text,
	`locatedFloor` integer,
	`numberFloors` integer,
	`buildingAge` integer,
	`kitchen` integer,
	`balcony` integer,
	`elevator` integer,
	`furnished` integer,
	`usageStatus` integer,
	`withinSite` integer,
	`membershipFee` integer,
	`creditEligibility` text,
	`location` text,
	`viewCount` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `advertisements_advertNo_unique` ON `advertisements` (`advertNo`);--> statement-breakpoint
CREATE TABLE `cities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `districts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`city_id` integer NOT NULL,
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `highlightAdvert` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`advertId` integer NOT NULL,
	`order` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `highlightAdvert_advertId_unique` ON `highlightAdvert` (`advertId`);--> statement-breakpoint
CREATE TABLE `neighborhoods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`district_id` integer NOT NULL,
	FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);