/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `frame_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `master_frame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "frame_history" ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "master_frame" ADD COLUMN     "status" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "user";
