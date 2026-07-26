/*
  Warnings:

  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL;
