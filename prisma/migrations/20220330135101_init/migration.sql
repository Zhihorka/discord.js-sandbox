/*
  Warnings:

  - You are about to drop the column `name` on the `Standup` table. All the data in the column will be lost.
  - Added the required column `date` to the `Standup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Standup" DROP COLUMN "name",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
