-- CreateTable
CREATE TABLE "master_frame" (
    "id" SERIAL NOT NULL,
    "pcb_barcode" TEXT NOT NULL,
    "sn_code_1" TEXT NOT NULL,
    "sn_code_2" TEXT NOT NULL,
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
    "warning_flag" TEXT NOT NULL,
    "protection_flag" TEXT NOT NULL,
    "fault_status_flag" TEXT NOT NULL,
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
    "voltage" INTEGER NOT NULL,
    "current" INTEGER NOT NULL,
    "remaining_capacity" INTEGER NOT NULL,
    "soc" INTEGER NOT NULL,
    "soh" INTEGER NOT NULL,
    "max_cell_voltage" INTEGER NOT NULL,
    "min_cell_voltage" INTEGER NOT NULL,
    "cell_voltage_diff" INTEGER NOT NULL,
    "max_cell_temperature" INTEGER NOT NULL,
    "min_cell_temperature" INTEGER NOT NULL,
    "remaining_charge_time" INTEGER NOT NULL,
    "remaining_discharge_time" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "frame_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "master_frame_pcb_barcode_key" ON "master_frame"("pcb_barcode");

-- AddForeignKey
ALTER TABLE "frame_logger" ADD CONSTRAINT "frame_logger_pcb_barcode_fkey" FOREIGN KEY ("pcb_barcode") REFERENCES "master_frame"("pcb_barcode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frame_history" ADD CONSTRAINT "frame_history_pcb_barcode_fkey" FOREIGN KEY ("pcb_barcode") REFERENCES "master_frame"("pcb_barcode") ON DELETE RESTRICT ON UPDATE CASCADE;
