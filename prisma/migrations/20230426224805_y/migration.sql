/*
  Warnings:

  - A unique constraint covering the columns `[uniqueName]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueName` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Player_name_key";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "uniqueName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_uniqueName_key" ON "Player"("uniqueName");
