-- CreateTable
CREATE TABLE "rectifier" (
    "id" SERIAL NOT NULL,
    "voltage" INTEGER NOT NULL,
    "current" INTEGER NOT NULL,
    "max_voltage_cell" INTEGER NOT NULL,
    "min_voltage_cell" INTEGER NOT NULL,
    "total_cell" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rectifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_frame" (
    "id" SERIAL NOT NULL,
    "pcb_barcode" TEXT NOT NULL,
    "sn_code_1" TEXT NOT NULL,
    "sn_code_2" TEXT NOT NULL,
    "charging" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_frame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frame_logger" (
    "id" SERIAL NOT NULL,
    "pcb_barcode" TEXT NOT NULL,
    "voltage" INTEGER NOT NULL,
    "current" INTEGER NOT NULL,
    "remaining_capacity" INTEGER NOT NULL,
    "average_cell_temperature" INTEGER NOT NULL,
    "env_temperature" INTEGER NOT NULL,
    "soc" INTEGER NOT NULL,
    "soh" INTEGER NOT NULL,
    "full_charged_cap" INTEGER NOT NULL,
    "cycle_count" INTEGER NOT NULL,
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
    "cell_voltage_diff" INTEGER NOT NULL,
    "max_cell_temperature" INTEGER NOT NULL,
    "min_cell_temperature" INTEGER NOT NULL,
    "fet_temperature" INTEGER NOT NULL,
    "cell_temperature_1" INTEGER NOT NULL,
    "cell_temperature_2" INTEGER NOT NULL,
    "cell_temperature_3" INTEGER NOT NULL,
    "cell_temperature_4" INTEGER NOT NULL,
    "ambient_temperature" INTEGER NOT NULL,
    "remaining_charge_time" INTEGER NOT NULL,
    "remaining_discharge_time" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "frame_logger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frame_history" (
    "id" SERIAL NOT NULL,
    "pcb_barcode" TEXT NOT NULL,
    "voltage" INTEGER,
    "current" INTEGER,
    "remaining_capacity" INTEGER,
    "soc" INTEGER,
    "soh" INTEGER,
    "max_cell_voltage" INTEGER,
    "min_cell_voltage" INTEGER,
    "cell_voltage_diff" INTEGER,
    "max_cell_temperature" INTEGER,
    "min_cell_temperature" INTEGER,
    "remaining_charge_time" INTEGER,
    "remaining_discharge_time" INTEGER,
    "charging" BOOLEAN,
    "error_status" BOOLEAN,
    "start_time" TEXT,
    "end_time" TEXT,
    "charging_time" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "frame_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frame_logger_error" (
    "id" SERIAL NOT NULL,
    "date_time" TEXT NOT NULL,
    "pcb_barcode" TEXT NOT NULL,
    "error_flag" TEXT,
    "error_case" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "frame_logger_error_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "master_frame_pcb_barcode_key" ON "master_frame"("pcb_barcode");

-- AddForeignKey
ALTER TABLE "frame_logger" ADD CONSTRAINT "frame_logger_pcb_barcode_fkey" FOREIGN KEY ("pcb_barcode") REFERENCES "master_frame"("pcb_barcode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frame_history" ADD CONSTRAINT "frame_history_pcb_barcode_fkey" FOREIGN KEY ("pcb_barcode") REFERENCES "master_frame"("pcb_barcode") ON DELETE RESTRICT ON UPDATE CASCADE;
