import { prisma } from "../index";
import * as ChargingDto from "../dto/charging.dto";
import moment from "moment-timezone";
import { CheckErrorLog } from "../helpers/errorFlagCheck";

const getAllMasterFrame = async (): Promise<ChargingDto.IMasterFrame[]> => {
  try {
    const masterFrame = await prisma.master_frame.findMany({
      orderBy: { id: "desc" },
    });
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

const checkChargingStatusWithPcbBarcode = async (
  pcb_barcode: string
): Promise<boolean> => {
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

const checkChargingStatus = async () => {
  try {
    const masterFrames = await prisma.master_frame.findMany({
      where: {
        charging: true,
      },
    });

    if (masterFrames && masterFrames.length > 0) {
      interface IResult {
        pcb_barcode: string;
        charging: boolean;
      }
      const results: IResult[] = masterFrames.map((frame) => ({
        pcb_barcode: frame.pcb_barcode,
        charging: frame.charging,
      }));
      return results;
    } else {
      throw new Error(`Did not find any charging running`);
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Did not find any charging running`);
  }
};

const createMasterFrame = async (payload: ChargingDto.IMasterFrame[]) => {
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
      return { status: false, pcb_barcode };
    })
  );
  return results;
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

      if (charging) {
        // create frame history data
        await prisma.frame_history.create({
          data: {
            pcb_barcode: pcbBarcode,
            start_time: moment()
              .tz("Asia/Jakarta")
              .format("YYYY-MM-DD HH:mm:ss"),
            charging: charging,
          },
        });
      }
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

const createErrorLog = async (payload: any) => {
  try {
    // warning_flag
    if (payload.warningFlag.length > 0) {
      payload.warningFlag.map(async (item: any) => {
        await prisma.frame_logger_error.create({
          data: {
            date_time: moment()
              .tz("Asia/Jakarta")
              .format("YYYY-MM-DD HH:mm:ss"),
            pcb_barcode: payload.pcb_barcode,
            error_flag: "warning_flag",
            error_case: item,
          },
        });
      });
    }

    // protection_flag
    if (payload.protectionFlag.length > 0) {
      payload.protectionFlag.map(async (item: any) => {
        await prisma.frame_logger_error.create({
          data: {
            date_time: moment()
              .tz("Asia/Jakarta")
              .format("YYYY-MM-DD HH:mm:ss"),
            pcb_barcode: payload.pcb_barcode,
            error_flag: "protection_flag",
            error_case: item,
          },
        });
      });
    }

    // fault_status_flag
    if (payload.faultStatusFlag.length > 0) {
      payload.faultStatusFlag.map(async (item: any) => {
        await prisma.frame_logger_error.create({
          data: {
            date_time: moment()
              .tz("Asia/Jakarta")
              .format("YYYY-MM-DD HH:mm:ss"),
            pcb_barcode: payload.pcb_barcode,
            error_flag: "fault_status_flag",
            error_case: item,
          },
        });
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create error log");
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
    const frameHistory = await prisma.frame_history.findMany({
      where: {
        pcb_barcode: pcb_barcode,
      },
      orderBy: { id: "desc" },
    });

    const isError = frameHistory.filter((item) => item.error_status === true);

    // if error_status is true
    if (isError.length > 0) {
      // find frame logger error where pcb_barcode
      // and date_time between start_time and end_time
      const results = await Promise.all(
        frameHistory.map(async (item) => {
          const {
            pcb_barcode,
            voltage = null,
            current = null,
            remaining_capacity = null,
            soc = null,
            soh = null,
            max_cell_voltage = null,
            min_cell_voltage = null,
            cell_voltage_diff = null,
            max_cell_temperature = null,
            min_cell_temperature = null,
            remaining_charge_time = null,
            remaining_discharge_time = null,
            charging = null,
            error_status = null,
            start_time = null,
            end_time = null,
            charging_time = null,
          } = item;

          if (start_time && end_time) {
            const frameLoggerError = await prisma.frame_logger_error.findMany({
              where: {
                pcb_barcode: pcb_barcode,
                date_time: {
                  gte: start_time,
                  lte: end_time,
                },
              },
              orderBy: { id: "desc" },
            });

            // collect error log data per error flag
            const warningFlag = frameLoggerError.filter(
              (item) => item.error_flag === "warning_flag"
            );
            const protectionFlag = frameLoggerError.filter(
              (item) => item.error_flag === "protection_flag"
            );
            const faultStatusFlag = frameLoggerError.filter(
              (item) => item.error_flag === "fault_status_flag"
            );

            // get date_time, pcb_barcode, error_flag, error_case
            const warningFlagCase = warningFlag.map((item) => {
              return {
                date_time: item.date_time,
                pcb_barcode: item.pcb_barcode,
                error_flag: item.error_flag,
                error_case: item.error_case,
              };
            });

            const protectionFlagCase = protectionFlag.map((item) => {
              return {
                date_time: item.date_time,
                pcb_barcode: item.pcb_barcode,
                error_flag: item.error_flag,
                error_case: item.error_case,
              };
            });

            const faultStatusFlagCase = faultStatusFlag.map((item) => {
              return {
                date_time: item.date_time,
                pcb_barcode: item.pcb_barcode,
                error_flag: item.error_flag,
                error_case: item.error_case,
              };
            });

            // combine frame history data and error log data
            return {
              pcb_barcode,
              voltage: voltage !== null ? voltage / 100 : null,
              current: current !== null ? current / 100 : null,
              remaining_capacity: remaining_capacity !== null ? remaining_capacity / 100 : null,
              soc: soc !== null ? soc / 100 : null,
              soh: soh !== null ? soh / 100 : null,
              max_cell_voltage: max_cell_voltage !== null ? max_cell_voltage : null,
              min_cell_voltage: min_cell_voltage !== null ? min_cell_voltage : null,
              cell_voltage_diff: cell_voltage_diff !== null ? cell_voltage_diff : null,
              max_cell_temperature: max_cell_temperature !== null ? max_cell_temperature / 10 : null,
              min_cell_temperature: min_cell_temperature !== null ? min_cell_temperature / 10 : null,
              remaining_charge_time: remaining_charge_time !== null ? remaining_charge_time : null,
              remaining_discharge_time: remaining_discharge_time !== null ? remaining_discharge_time : null,
              charging: charging,
              error_status: error_status,
              start_time: start_time,
              end_time: end_time,
              charging_time: charging_time,
              errorLog: {
                warningFlag: warningFlagCase,
                protectionFlag: protectionFlagCase,
                faultStatusFlag: faultStatusFlagCase,
              },
            };
          } else {
            throw new Error(`Frame History ${pcb_barcode} Not Found`);
          }
        })
      );

      return results;
    } else {
      throw new Error(`Frame History ${pcb_barcode} Not Found`);
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Frame History ${pcb_barcode} Not Found`);
  }
};

const updateFrameHistory = async (payload: ChargingDto.IFrameHistory[]) => {
  const results = await Promise.all(
    payload.map(async (item: ChargingDto.IFrameHistory) => {
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
        return { status: false, pcb_barcode: item.pcb_barcode };
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

      // check error log
      const checkFlag = await new CheckErrorLog();
      const warningFlag = await checkFlag.warningFlagCheck(item);
      const protectionFlag = await checkFlag.protectionFlagCheck(item);
      const faultStatusFlag = await checkFlag.faultStatusFlagCheck(item);
      const error_status =
        warningFlag.length > 0 ||
        protectionFlag.length > 0 ||
        faultStatusFlag.length > 0
          ? true
          : false;

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
            error_status: error_status,
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
      return { status: true, pcb_barcode: item.pcb_barcode };
    })
  );
  return results;
};

export {
  getAllMasterFrame,
  getMasterFrame,
  checkChargingStatusWithPcbBarcode,
  checkChargingStatus,
  createMasterFrame,
  updateMasterFrame,
  createLogData,
  createErrorLog,
  getAllFrameHistory,
  getFrameHistory,
  updateFrameHistory,
};
