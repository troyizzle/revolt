-- DropForeignKey
ALTER TABLE "Race" DROP CONSTRAINT "Race_eventId_fkey";

-- AlterTable
ALTER TABLE "Season" ALTER COLUMN "endDate" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
