/*
  Warnings:

  - Added the required column `points` to the `PlayerRace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `PlayerRace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerRace" ADD COLUMN     "points" INTEGER NOT NULL,
ADD COLUMN     "token" INTEGER NOT NULL;
