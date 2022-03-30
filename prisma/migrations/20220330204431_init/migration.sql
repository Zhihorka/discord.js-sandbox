/*
  Warnings:

  - Added the required column `queuePosition` to the `Speaker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Speaker" ADD COLUMN     "queuePosition" INTEGER NOT NULL;
