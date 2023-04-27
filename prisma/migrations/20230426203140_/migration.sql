/*
  Warnings:

  - A unique constraint covering the columns `[playerId,raceId]` on the table `PlayerRace` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[raceId,position]` on the table `PlayerRace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `PlayerRace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerRace" ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PlayerRace_playerId_raceId_key" ON "PlayerRace"("playerId", "raceId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerRace_raceId_position_key" ON "PlayerRace"("raceId", "position");
