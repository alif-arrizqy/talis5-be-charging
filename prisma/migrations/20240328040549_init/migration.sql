/*
  Warnings:

  - You are about to drop the column `status` on the `frame_history` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `master_frame` table. All the data in the column will be lost.
  - Added the required column `charging` to the `frame_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `charging` to the `master_frame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "frame_history" DROP COLUMN "status",
ADD COLUMN     "charging" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "master_frame" DROP COLUMN "status",
ADD COLUMN     "charging" BOOLEAN NOT NULL;
