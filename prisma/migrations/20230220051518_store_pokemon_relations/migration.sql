/*
 Warnings:

 - You are about to drop the column `votedAgainst` on the `Vote` table. All the data in the column will be lost.
 - You are about to drop the column `votedFor` on the `Vote` table. All the data in the column will be lost.
 - Added the required column `votedAgainstId` to the `Vote` table without a default value. This is not possible if the table is not empty.
 - Added the required column `votedForId` to the `Vote` table without a default value. This is not possible if the table is not empty.

 */
-- CreateTable
CREATE TABLE "Pokemon" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "spriteUrl" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys = OFF;

Create TABLE "Vote" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "votedForId" INTEGER NOT NULL,
  "votedAgainstId" INTEGER NOT NULL,
  CONSTRAINT "Vote_votedForId_fkey" FOREIGN KEY ("votedForId") REFERENCES "Pokemon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Vote_votedAgainstId_fkey" FOREIGN KEY ("votedAgainstId") REFERENCES "Pokemon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
