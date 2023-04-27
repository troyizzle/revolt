/*
  Warnings:

  - You are about to drop the column `token` on the `PlayerRace` table. All the data in the column will be lost.
  - Added the required column `tokens` to the `PlayerRace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerRace" DROP COLUMN "token",
ADD COLUMN     "tokens" INTEGER NOT NULL;
