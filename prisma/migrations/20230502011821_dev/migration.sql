/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `Race` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `laps` to the `Race` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Race" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "laps" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "scheduledDate" TIMESTAMP(3),
    "track" TEXT,
    "laps" INTEGER,
    "ip" TEXT,
    "serverStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resultsUrl" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Race_eventId_key" ON "Race"("eventId");

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
