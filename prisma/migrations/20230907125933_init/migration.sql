/*
  Warnings:

  - Added the required column `permission` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "permission" INTEGER NOT NULL
);
INSERT INTO "new_Users" ("password", "username") SELECT "password", "username" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
