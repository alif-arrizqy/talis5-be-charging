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

const getMasterFrame = async (
  pcb_barcode: string
): Promise<ChargingDto.IMasterFrameOutput> => {
  try {
    const masterFrame = await prisma.master_frame.findFirst({
      where: {
        pcb_barcode: pcb_barcode,
      },
    });

    if (masterFrame) {
      return masterFrame;
    } else {
      throw new Error(`Master Frame ${pcb_barcode} Not Found `);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to retrieve master frame data");
  }
};

const checkChargingStatus = async (pcb_barcode: string): Promise<boolean> => {
  try {
    const masterFrame = await prisma.master_frame.findFirst({
      where: {
        pcb_barcode: pcb_barcode,
      },
    });

    if (masterFrame) {
      return masterFrame.charging;
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
) => {
  const results = await Promise.all(
    payload.map(async (item: ChargingDto.IMasterFrame) => {
      const { pcb_barcode, sn_code_1, sn_code_2 } = item;

      // Check if data exists
      const isExist = await prisma.master_frame.findFirst({
        where: {
          pcb_barcode,
        },
      });

      // If data does not exist, create master frame data and frame history data
      if (!isExist) {
        await prisma.master_frame.create({
          data: {
            pcb_barcode,
            sn_code_1,
            sn_code_2,
            charging: true,
          },
        });

        await prisma.frame_history.create({
          data: {
            pcb_barcode,
            start_time: moment()
              .tz("Asia/Jakarta")
              .format("YYYY-MM-DD HH:mm:ss"),
            charging: true,
          },
        });

        return { status: true, pcb_barcode };
      }

      // if data exists, return false and pcb_barcode
      return { status: false, pcb_barcode }
    })
  );
  return results
};

const updateMasterFrame = async (
  pcbBarcode: string,
  charging: boolean
): Promise<boolean> => {
  try {
    const masterFrame = await prisma.master_frame.findFirst({
      where: {
        pcb_barcode: pcbBarcode,
      },
    });

    if (masterFrame) {
      await prisma.master_frame.update({
        where: {
          pcb_barcode: pcbBarcode,
        },
        data: {
          charging: charging,
        },
      });

      // create frame history data
      await prisma.frame_history.create({
        data: {
          pcb_barcode: pcbBarcode,
          start_time: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
          charging: charging,
        },
      });
      return true;
    } else {
      throw new Error(`Master Frame ${pcbBarcode} Not Found `);
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const createLogData = async (
  payload: ChargingDto.IStoreLog
): Promise<ChargingDto.IStoreLogOutput> => {
  try {
    // store data
    await prisma.frame_logger.create({
      data: {
        pcb_barcode: payload.pcb_barcode,
        voltage: payload.voltage,
        current: payload.current,
        remaining_capacity: payload.remaining_capacity,
        average_cell_temperature: payload.average_cell_temperature,
        env_temperature: payload.env_temperature,
        warning_flag: JSON.stringify(payload.warning_flag),
        protection_flag: JSON.stringify(payload.protection_flag),
        fault_status_flag: JSON.stringify(payload.fault_status_flag),
        soc: payload.soc,
        soh: payload.soh,
        full_charged_cap: payload.full_charged_cap,
        cycle_count: payload.cycle_count,
        cell_voltage_1: payload.cell_voltage_1,
        cell_voltage_2: payload.cell_voltage_2,
        cell_voltage_3: payload.cell_voltage_3,
        cell_voltage_4: payload.cell_voltage_4,
        cell_voltage_5: payload.cell_voltage_5,
        cell_voltage_6: payload.cell_voltage_6,
        cell_voltage_7: payload.cell_voltage_7,
        cell_voltage_8: payload.cell_voltage_8,
        cell_voltage_9: payload.cell_voltage_9,
        cell_voltage_10: payload.cell_voltage_10,
        cell_voltage_11: payload.cell_voltage_11,
        cell_voltage_12: payload.cell_voltage_12,
        cell_voltage_13: payload.cell_voltage_13,
        cell_voltage_14: payload.cell_voltage_14,
        cell_voltage_15: payload.cell_voltage_15,
        cell_voltage_16: payload.cell_voltage_16,
        max_cell_voltage: payload.max_cell_voltage,
        min_cell_voltage: payload.min_cell_voltage,
        cell_voltage_diff: payload.cell_voltage_diff,
        max_cell_temperature: payload.max_cell_temperature,
        min_cell_temperature: payload.min_cell_temperature,
        fet_temperature: payload.fet_temperature,
        cell_temperature_1: payload.cell_temperature_1,
        cell_temperature_2: payload.cell_temperature_2,
        cell_temperature_3: payload.cell_temperature_3,
        cell_temperature_4: payload.cell_temperature_4,
        ambient_temperature: payload.ambient_temperature,
        remaining_charge_time: payload.remaining_charge_time,
        remaining_discharge_time: payload.remaining_discharge_time,
      },
    });

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
        // const isExist = await prisma.frame_history.findFirst({
        //   where: {
        //     pcb_barcode: item.pcb_barcode,
        //   },
        // });

        const isExist = await prisma.frame_history.findMany({
          where: {
            pcb_barcode: item.pcb_barcode,
            charging: true,
          },
          orderBy: {
            id: "desc",
          },
          take: 1,
        });

        if (isExist.length === 0) {
          throw new Error(`Frame History ${item.pcb_barcode} Not Found`);
        }

        // calculate charging time
        const end_time = moment()
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD HH:mm:ss");
        const duration = moment.duration(
          moment(end_time).diff(isExist[0]?.start_time)
        );

        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();

        // Format the result
        const formattedResult = `${hours} hours ${minutes} minutes`;

        // Update frame history data
        if (isExist) {
          await prisma.frame_history.update({
            where: {
              id: isExist[0]?.id,
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
  checkChargingStatus,
  createMasterFrame,
  updateMasterFrame,
  createLogData,
  getAllFrameHistory,
  getFrameHistory,
  updateFrameHistory,
};
