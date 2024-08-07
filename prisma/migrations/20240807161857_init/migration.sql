/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `package` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `package_id_key` ON `package`(`id`);
