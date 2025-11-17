/*
  Warnings:

  - You are about to drop the column `approved` on the `reservation` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'APROVED', 'CANCELED');

-- AlterTable
ALTER TABLE "reservation" DROP COLUMN "approved",
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING';
