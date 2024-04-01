-- AlterTable
ALTER TABLE "frame_history" ALTER COLUMN "voltage" DROP NOT NULL,
ALTER COLUMN "current" DROP NOT NULL,
ALTER COLUMN "remaining_capacity" DROP NOT NULL,
ALTER COLUMN "soc" DROP NOT NULL,
ALTER COLUMN "soh" DROP NOT NULL,
ALTER COLUMN "max_cell_voltage" DROP NOT NULL,
ALTER COLUMN "min_cell_voltage" DROP NOT NULL,
ALTER COLUMN "cell_voltage_diff" DROP NOT NULL,
ALTER COLUMN "max_cell_temperature" DROP NOT NULL,
ALTER COLUMN "min_cell_temperature" DROP NOT NULL,
ALTER COLUMN "remaining_charge_time" DROP NOT NULL,
ALTER COLUMN "remaining_discharge_time" DROP NOT NULL,
ALTER COLUMN "charging" DROP NOT NULL,
ALTER COLUMN "end_time" DROP NOT NULL,
ALTER COLUMN "start_time" DROP NOT NULL;