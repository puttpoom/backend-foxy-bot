/*
  Warnings:

  - You are about to drop the column `herf` on the `package` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `package` DROP COLUMN `herf`,
    ADD COLUMN `href` VARCHAR(191) NULL;
