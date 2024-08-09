import { prisma } from "../index";
import * as DischargingDto from "../dto/discharging.dto";

const createLogDischarging = async (
  payload: DischargingDto.IData
): Promise<{}> => {
  try {
    await prisma.logger_discharge.create({
      data: {
        ...payload
      },
    })
    return true;
  } catch (error) {
    console.log("Error in createLogDischarging", error);
    throw new Error("Error in createLogDischarging");
  }
};

const getByPackBarcode = async (packBarcode: string): Promise<{}> => {
  try {
    const isExist = await prisma.logger_discharge.findMany({
      where: {
        pack_barcode: packBarcode,
      },
    });

    if (isExist.length === 0) {
      throw new Error(`Pack barcode ${packBarcode} not found`);
    } else {
      console.log(isExist);
      return isExist;
    }
  } catch (error) {
    console.log("Error in getByPackBarcode", error);
    throw new Error("Error in getByPackBarcode");
  }
};

const getByPcbBarcode = async (pcbBarcode: string): Promise<{}> => {
  try {
    const isExist = await prisma.logger_discharge.findMany({
      where: {
        pcb_barcode: pcbBarcode,
      },
    });

    if (isExist.length === 0) {
      throw new Error(`Pcb barcode ${pcbBarcode} not found`);
    } else {
      console.log(isExist);
      return isExist;
    }
  } catch (error) {
    console.log("Error in getByPcbBarcode", error);
    throw new Error("Error in getByPcbBarcode");
  }
};

export { createLogDischarging, getByPackBarcode, getByPcbBarcode };
