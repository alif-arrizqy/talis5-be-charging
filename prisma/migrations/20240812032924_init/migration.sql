/*
  Warnings:

  - You are about to alter the column `full_capacity` on the `logger_discharge` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "logger_discharge" ALTER COLUMN "total_voltage" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "full_capacity" SET DATA TYPE INTEGER;
