-- DropForeignKey
ALTER TABLE `secretCode` DROP FOREIGN KEY `secretCode_userId_fkey`;

-- AlterTable
ALTER TABLE `secretCode` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `secretCode` ADD CONSTRAINT `secretCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
