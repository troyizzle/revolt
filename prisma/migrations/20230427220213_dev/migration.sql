-- DropForeignKey
ALTER TABLE "PlayerRace" DROP CONSTRAINT "PlayerRace_playerId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerRace" DROP CONSTRAINT "PlayerRace_raceId_fkey";

-- AddForeignKey
ALTER TABLE "PlayerRace" ADD CONSTRAINT "PlayerRace_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRace" ADD CONSTRAINT "PlayerRace_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE CASCADE ON UPDATE CASCADE;
