-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quote" (
    "id" DATETIME NOT NULL PRIMARY KEY,
    "bookId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "quotee" TEXT,
    CONSTRAINT "Quote_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quote" ("bookId", "content", "id", "quotee") SELECT "bookId", "content", "id", "quotee" FROM "Quote";
DROP TABLE "Quote";
ALTER TABLE "new_Quote" RENAME TO "Quote";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
