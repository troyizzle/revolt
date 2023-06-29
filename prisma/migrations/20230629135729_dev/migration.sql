/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `laps` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `resultsUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `serverStatus` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `track` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `tokens` on the `PlayerRace` table. All the data in the column will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `eventId` on table `Race` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Race" DROP CONSTRAINT "Race_eventId_fkey";

-- DropIndex
DROP INDEX "Race_eventId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "ip",
DROP COLUMN "laps",
DROP COLUMN "resultsUrl",
DROP COLUMN "scheduledDate",
DROP COLUMN "serverStatus",
DROP COLUMN "track",
DROP COLUMN "updatedAt",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "shortName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "teamId",
DROP COLUMN "token";

-- AlterTable
ALTER TABLE "PlayerRace" DROP COLUMN "tokens";

-- AlterTable
ALTER TABLE "Race" ALTER COLUMN "eventId" SET NOT NULL;

-- DropTable
DROP TABLE "Team";

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
