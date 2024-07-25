/*
  Warnings:

  - You are about to drop the column `endDate` on the `subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `subscription` DROP COLUMN `endDate`,
    ADD COLUMN `isExpired` BOOLEAN NOT NULL DEFAULT false;
