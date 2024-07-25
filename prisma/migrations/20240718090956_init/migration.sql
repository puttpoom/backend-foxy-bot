/*
  Warnings:

  - You are about to drop the `secret_code` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usage_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `secret_code` DROP FOREIGN KEY `secret_code_userId_fkey`;

-- DropForeignKey
ALTER TABLE `usage_history` DROP FOREIGN KEY `usage_history_userId_fkey`;

-- DropTable
DROP TABLE `secret_code`;

-- DropTable
DROP TABLE `usage_history`;

-- CreateTable
CREATE TABLE `secretCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `isActivated` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `secretCode_code_key`(`code`),
    UNIQUE INDEX `secretCode_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usageHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `linkGoods` VARCHAR(191) NOT NULL,
    `usedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `secretCode` ADD CONSTRAINT `secretCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usageHistory` ADD CONSTRAINT `usageHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
