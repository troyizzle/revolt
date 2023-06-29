/*
  Warnings:

  - Added the required column `averageLap` to the `PlayerRace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerRace" ADD COLUMN     "averageLap" TEXT NOT NULL,
ADD COLUMN     "gap" TEXT,
ADD COLUMN     "interval" TEXT;
