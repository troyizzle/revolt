-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL,
    "map" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerRace" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "car" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "bestLap" DOUBLE PRECISION NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "cheating" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerRace_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerRace" ADD CONSTRAINT "PlayerRace_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRace" ADD CONSTRAINT "PlayerRace_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
