/*
  Warnings:

  - Added the required column `queued` to the `Standup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusChecked` to the `Standup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Standup" ADD COLUMN     "queued" BOOLEAN NOT NULL,
ADD COLUMN     "statusChecked" BOOLEAN NOT NULL;
