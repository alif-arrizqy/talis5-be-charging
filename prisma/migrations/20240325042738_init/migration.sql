/*
  Warnings:

  - Added the required column `max_voltage_cell` to the `rectifier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min_voltage_cell` to the `rectifier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_cell` to the `rectifier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rectifier" ADD COLUMN     "max_voltage_cell" INTEGER NOT NULL,
ADD COLUMN     "min_voltage_cell" INTEGER NOT NULL,
ADD COLUMN     "total_cell" INTEGER NOT NULL;
