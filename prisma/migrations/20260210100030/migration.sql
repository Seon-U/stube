-- CreateTable
CREATE TABLE `channel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `channel_api_id` VARCHAR(255) NOT NULL,
    `memberId` INTEGER NOT NULL,
    `accessToken` VARCHAR(255) NULL,
    `channelThumb` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NULL,
    `lastSelected` BOOLEAN NOT NULL,
    `refreshToken` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `syncAt` DATETIME(3) NULL,

    UNIQUE INDEX `channel_channel_api_id_key`(`channel_api_id`),
    INDEX `fk_member_channel`(`memberId`),
    INDEX `id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `googleId` VARCHAR(255) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `outdt` DATETIME(0) NULL,
    `image` VARCHAR(255) NULL,
    `name` VARCHAR(45) NULL,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    UNIQUE INDEX `google_user_id_UNIQUE`(`googleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playlist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playlistApiId` VARCHAR(255) NOT NULL,
    `channelId` INTEGER NOT NULL,
    `title` TEXT NOT NULL,
    `description` TEXT NULL,
    `itemCount` INTEGER NULL,
    `publishedAt` DATETIME(0) NULL,
    `createdAt` TIMESTAMP(0) NULL,
    `creatorId` VARCHAR(255) NULL,

    UNIQUE INDEX `playlist_playlistApiId_key`(`playlistApiId`),
    INDEX `channelId_idx`(`channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playlistId` INTEGER NOT NULL,
    `title` TEXT NULL,
    `description` TEXT NULL,
    `thumbnailUrl` VARCHAR(255) NULL,
    `creatorId` VARCHAR(255) NULL,
    `publishedAt` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NULL,
    `updatedAt` DATETIME(0) NULL,
    `listApiId` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `videoApiId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `video_listApiId_key`(`listApiId`),
    INDEX `id_idx`(`playlistId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `channel` ADD CONSTRAINT `fk_member_channel` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlist` ADD CONSTRAINT `fk_channel_playlist` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video` ADD CONSTRAINT `fk_playlist_video` FOREIGN KEY (`playlistId`) REFERENCES `playlist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
