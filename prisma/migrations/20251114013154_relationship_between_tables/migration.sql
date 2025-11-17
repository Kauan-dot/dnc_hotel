/*
  Warnings:

  - Added the required column `hotelId` to the `reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservation" ADD COLUMN     "hotelId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
