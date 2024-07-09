/*
  Warnings:

  - You are about to drop the `ExpPackage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HistoryLogin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Package` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsageHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ExpPackage` DROP FOREIGN KEY `ExpPackage_packageId_fkey`;

-- DropForeignKey
ALTER TABLE `ExpPackage` DROP FOREIGN KEY `ExpPackage_userId_fkey`;

-- DropForeignKey
ALTER TABLE `HistoryLogin` DROP FOREIGN KEY `HistoryLogin_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UsageHistory` DROP FOREIGN KEY `UsageHistory_userId_fkey`;

-- DropTable
DROP TABLE `ExpPackage`;

-- DropTable
DROP TABLE `HistoryLogin`;

-- DropTable
DROP TABLE `Package`;

-- DropTable
DROP TABLE `UsageHistory`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `uuid` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history_login` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `loginAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exp_package` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `packageId` INTEGER NOT NULL,
    `expiration` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `package_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usage_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `linkGoods` VARCHAR(191) NOT NULL,
    `usedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `history_login` ADD CONSTRAINT `history_login_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exp_package` ADD CONSTRAINT `exp_package_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exp_package` ADD CONSTRAINT `exp_package_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usage_history` ADD CONSTRAINT `usage_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
