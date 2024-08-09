-- CreateTable
CREATE TABLE "logger_discharge" (
    "id" SERIAL NOT NULL,
    "address" INTEGER NOT NULL,
    "rxtx" TEXT NOT NULL,
    "pcb_barcode" TEXT NOT NULL,
    "pack_barcode" TEXT NOT NULL,
    "date_time" TEXT NOT NULL,
    "cell_count" INTEGER NOT NULL,
    "cell_voltage_1" INTEGER NOT NULL,
    "cell_voltage_2" INTEGER NOT NULL,
    "cell_voltage_3" INTEGER NOT NULL,
    "cell_voltage_4" INTEGER NOT NULL,
    "cell_voltage_5" INTEGER NOT NULL,
    "cell_voltage_6" INTEGER NOT NULL,
    "cell_voltage_7" INTEGER NOT NULL,
    "cell_voltage_8" INTEGER NOT NULL,
    "cell_voltage_9" INTEGER NOT NULL,
    "cell_voltage_10" INTEGER NOT NULL,
    "cell_voltage_11" INTEGER NOT NULL,
    "cell_voltage_12" INTEGER NOT NULL,
    "cell_voltage_13" INTEGER NOT NULL,
    "cell_voltage_14" INTEGER NOT NULL,
    "cell_voltage_15" INTEGER NOT NULL,
    "cell_voltage_16" INTEGER NOT NULL,
    "max_cell_voltage" INTEGER NOT NULL,
    "min_cell_voltage" INTEGER NOT NULL,
    "total_voltage" INTEGER NOT NULL,
    "current" INTEGER NOT NULL,
    "full_capacity" INTEGER NOT NULL,
    "remaining_capacity" DOUBLE PRECISION NOT NULL,
    "all_chg_ah" INTEGER NOT NULL,
    "all_dsg_ah" INTEGER NOT NULL,
    "all_chg_time" DOUBLE PRECISION NOT NULL,
    "all_dsg_time" DOUBLE PRECISION NOT NULL,
    "all_chg_kwh" DOUBLE PRECISION NOT NULL,
    "all_dsg_kwh" DOUBLE PRECISION NOT NULL,
    "soc" DOUBLE PRECISION NOT NULL,
    "soh" DOUBLE PRECISION NOT NULL,
    "temperature_count" INTEGER NOT NULL,
    "cell_temperature_1" DOUBLE PRECISION NOT NULL,
    "cell_temperature_2" DOUBLE PRECISION NOT NULL,
    "cell_temperature_3" DOUBLE PRECISION NOT NULL,
    "cell_temperature_4" DOUBLE PRECISION NOT NULL,
    "mos_temp" DOUBLE PRECISION NOT NULL,
    "amb_temp" DOUBLE PRECISION NOT NULL,
    "status_code" TEXT NOT NULL,
    "status_log" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logger_discharge_pkey" PRIMARY KEY ("id")
);