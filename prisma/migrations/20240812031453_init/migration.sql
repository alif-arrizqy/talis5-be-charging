/*
  Warnings:

  - You are about to alter the column `all_chg_kwh` on the `logger_discharge` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `all_dsg_kwh` on the `logger_discharge` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "logger_discharge" ALTER COLUMN "full_capacity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "all_chg_kwh" SET DATA TYPE INTEGER,
ALTER COLUMN "all_dsg_kwh" SET DATA TYPE INTEGER;
