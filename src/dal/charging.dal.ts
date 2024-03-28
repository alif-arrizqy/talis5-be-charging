import { prisma } from "../index";
import * as ChargingDto from "../dto/charging.dto";
import moment from "moment-timezone";

const getAllMasterFrame = async (): Promise<ChargingDto.IMasterFrame[]> => {
  try {
    const masterFrame = await prisma.master_frame.findMany();
    return masterFrame;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to retrieve master frame data");
  }
};

const getMasterFrame = async (pcb_barcode: string): Promise<ChargingDto.IMasterFrameOutput> => {
  try {
    const masterFrame = await prisma.master_frame.findFirst({
      where: {
        pcb_barcode: pcb_barcode,
      },
    });

    if (masterFrame) {
      return masterFrame
    } else {
      throw new Error(`Master Frame ${pcb_barcode} Not Found `);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to retrieve master frame data");
  }
};

const createMasterFrame = async (
  payload: ChargingDto.IMasterFrame[]
): Promise<boolean> => {
  try {
    const results = await Promise.all(
      payload.map(async (item: ChargingDto.IMasterFrame) => {
        // Check if data exists
        const isExist = await prisma.master_frame.findFirst({
          where: {
            pcb_barcode: item.pcb_barcode,
          },
        });

        // Create or update master frame data
        if (!isExist) {
          await prisma.master_frame.create({
            data: {
              pcb_barcode: item.pcb_barcode,
              sn_code_1: item.sn_code_1,
              sn_code_2: item.sn_code_2,
              charging: true,
            },
          });
        } else {
          await prisma.master_frame.update({
            where: {
              id: isExist.id,
            },
            data: {
              pcb_barcode: item.pcb_barcode,
              sn_code_1: item.sn_code_1,
              sn_code_2: item.sn_code_2,
              charging: true,
            },
          });
        }

        // Create frame history data
        await prisma.frame_history.create({
          data: {
            pcb_barcode: item.pcb_barcode,
            start_time: moment()
              .tz("Asia/Jakarta")
              .format("YYYY-MM-DD HH:mm:ss"),
            charging: true,
          },
        });

        return true;
      })
    );

    return results.every((result) => result); // Returns true if all items in the results array are true
  } catch (error) {
    console.log(error);
    return false;
  }
};

const createLogData = async (
  payload: any
): Promise<ChargingDto.IStoreLogOutput> => {
  try {
    await Promise.all(
      payload.map(async (item: ChargingDto.IStoreLog) => {
        try {
          // store data
          await prisma.frame_logger.create({
            data: {
              pcb_barcode: item.pcb_barcode,
              voltage: item.voltage,
              current: item.current,
              remaining_capacity: item.remaining_capacity,
              average_cell_temperature: item.average_cell_temperature,
              env_temperature: item.env_temperature,
              warning_flag: JSON.stringify(item.warning_flag),
              protection_flag: JSON.stringify(item.protection_flag),
              fault_status_flag: JSON.stringify(item.fault_status_flag),
              soc: item.soc,
              soh: item.soh,
              full_charged_cap: item.full_charged_cap,
              cycle_count: item.cycle_count,
              cell_voltage_1: item.cell_voltage_1,
              cell_voltage_2: item.cell_voltage_2,
              cell_voltage_3: item.cell_voltage_3,
              cell_voltage_4: item.cell_voltage_4,
              cell_voltage_5: item.cell_voltage_5,
              cell_voltage_6: item.cell_voltage_6,
              cell_voltage_7: item.cell_voltage_7,
              cell_voltage_8: item.cell_voltage_8,
              cell_voltage_9: item.cell_voltage_9,
              cell_voltage_10: item.cell_voltage_10,
              cell_voltage_11: item.cell_voltage_11,
              cell_voltage_12: item.cell_voltage_12,
              cell_voltage_13: item.cell_voltage_13,
              cell_voltage_14: item.cell_voltage_14,
              cell_voltage_15: item.cell_voltage_15,
              cell_voltage_16: item.cell_voltage_16,
              max_cell_voltage: item.max_cell_voltage,
              min_cell_voltage: item.min_cell_voltage,
              cell_voltage_diff: item.cell_voltage_diff,
              max_cell_temperature: item.max_cell_temperature,
              min_cell_temperature: item.min_cell_temperature,
              fet_temperature: item.fet_temperature,
              cell_temperature_1: item.cell_temperature_1,
              cell_temperature_2: item.cell_temperature_2,
              cell_temperature_3: item.cell_temperature_3,
              cell_temperature_4: item.cell_temperature_4,
              ambient_temperature: item.ambient_temperature,
              remaining_charge_time: item.remaining_charge_time,
              remaining_discharge_time: item.remaining_discharge_time,
            },
          });
          return true;
        } catch (error) {
          console.log(error);
          throw new Error("Failed to create log data");
        }
      })
    );

    // Return a placeholder value or define your own return value as needed
    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create log data");
  }
};

const getAllFrameHistory = async (): Promise<
  ChargingDto.IFrameHistoryOutput[]
> => {
  try {
    const frameHistory = await prisma.frame_history.findMany();
    return frameHistory;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to retrieve frame history data");
  }
};

const getFrameHistory = async (
  pcb_barcode: string
): Promise<ChargingDto.IFrameHistoryOutput> => {
  try {
    const frameHistory = await prisma.frame_history.findFirst({
      where: {
        pcb_barcode: pcb_barcode,
      },
    });

    if (frameHistory) {
      return frameHistory;
    } else {
      throw new Error(`Frame History ${pcb_barcode} Not Found`);
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Frame History ${pcb_barcode} Not Found`);
  }
};

const updateFrameHistory = async (payload: any): Promise<boolean> => {
  try {
    const results = await Promise.all(
      payload.map(async (item: ChargingDto.IFrameHistory) => {
        // Check if data exists
        const isExist = await prisma.frame_history.findFirst({
          where: {
            pcb_barcode: item.pcb_barcode,
          },
        });

        // calculate charging time
        const end_time = moment()
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD HH:mm:ss");
        const duration = moment.duration(
          moment(end_time).diff(isExist?.start_time)
        );

        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();

        // Format the result
        const formattedResult = `${hours} hours ${minutes} minutes`;

        // Update frame history data
        if (isExist) {
          await prisma.frame_history.update({
            where: {
              id: isExist.id,
            },
            data: {
              voltage: item.voltage,
              current: item.current,
              remaining_capacity: item.remaining_capacity,
              soc: item.soc,
              soh: item.soh,
              max_cell_voltage: item.max_cell_voltage,
              min_cell_voltage: item.min_cell_voltage,
              cell_voltage_diff: item.cell_voltage_diff,
              max_cell_temperature: item.max_cell_temperature,
              min_cell_temperature: item.min_cell_temperature,
              remaining_charge_time: item.remaining_charge_time,
              remaining_discharge_time: item.remaining_discharge_time,
              end_time: end_time,
              charging_time: formattedResult,
              charging: false,
            },
          });

          // update master frame data
          await prisma.master_frame.update({
            where: {
              pcb_barcode: item.pcb_barcode,
            },
            data: {
              charging: false,
            },
          });
        }

        return true;
      })
    );
    return results.every((result) => result); // Returns true if all items in the results array are true
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  getAllMasterFrame,
  getMasterFrame,
  createLogData,
  createMasterFrame,
  getAllFrameHistory,
  getFrameHistory,
  updateFrameHistory,
};
