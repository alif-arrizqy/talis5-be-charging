import { prisma } from "../index";
import * as RectiDto from "../dto/recti.dto";

const getAll = async (): Promise<RectiDto.RectiOutput[]> => {
  const resp = await prisma.rectifier.findMany();
  return resp.map((rectifier) => ({
    voltage: rectifier.voltage,
    current: rectifier.current,
  }));
};

const createRecti = async (payload: RectiDto.RectiInput): Promise<boolean> => {
  const maxVoltCell: number = payload.maxVoltageCell;
  const minVoltCell: number = payload.minVoltageCell;
  const totalCell: number = payload.totalCell;
  const voltage: number = maxVoltCell * totalCell;
  const current: number = payload.current;

  // find rectifier data
  const isExist = await prisma.rectifier.findFirst();
  if (isExist) {
    if (
      isExist.voltage === voltage &&
      isExist.current === current &&
      isExist.max_voltage_cell === maxVoltCell &&
      isExist.min_voltage_cell === minVoltCell &&
      isExist.total_cell === totalCell
    ) {
      return true;
    } else {
      await prisma.rectifier.update({
        where: { id: isExist.id },
        data: {
          voltage: voltage,
          current: current,
          max_voltage_cell: maxVoltCell,
          min_voltage_cell: minVoltCell,
          total_cell: totalCell,
        },
      });
      return true;
    }
  } else {
    await prisma.rectifier.create({
      data: {
        voltage: voltage,
        current: current,
        max_voltage_cell: maxVoltCell,
        min_voltage_cell: minVoltCell,
        total_cell: totalCell,
      },
    });
    return false;
  }
};

const createDefaultValue = async (): Promise<RectiDto.RectiOutput> => {
  // find rectifier data
  const isExist = await prisma.rectifier.findFirst();
  if (isExist) {
    await prisma.rectifier.update({
      where: { id: isExist.id },
      data: {
        voltage: 115200,
        current: 40,
        max_voltage_cell: 3600,
        min_voltage_cell: 3000,
        total_cell: 32,
      },
    });
    return true;
  } else {
    await prisma.rectifier.create({
      data: {
        voltage: 115200,
        current: 40,
        max_voltage_cell: 3600,
        min_voltage_cell: 3000,
        total_cell: 32,
      },
    });
    return false;
  }
};

const createVoltage = async (
  payload: RectiDto.RectiVoltageDto
): Promise<RectiDto.RectiVOltageOutput | null> => {
  const maxVoltCell: number = payload.maxVoltageCell;
  const minVoltCell: number = payload.minVoltageCell;
  const totalCell: number = payload.totalCell;
  const voltage: number = maxVoltCell * totalCell;

  // find voltage value in rectifier data
  const findVoltage = await prisma.rectifier.findFirst();
  if (findVoltage) {
    if (findVoltage.voltage === voltage) {
      return voltage;
    } else {
      await prisma.rectifier.update({
        where: { id: findVoltage.id },
        data: {
          voltage: voltage,
          max_voltage_cell: maxVoltCell,
          min_voltage_cell: minVoltCell,
          total_cell: totalCell,
        },
      });
      return voltage;
    }
  } else {
    return null;
  }
};

const createCurrent = async (
  payload: RectiDto.RectiCurrentDto
): Promise<RectiDto.RectiCurrentOutput | null> => {
  const current: number = payload.current;
  const findCurrent = await prisma.rectifier.findFirst();
  if (findCurrent) {
    if (findCurrent.current === current) {
      return current;
    } else {
      await prisma.rectifier.update({
        where: { id: findCurrent.id },
        data: {
          current: current,
        },
      });
      return current;
    }
  } else {
    return null;
  }
};

export {
  getAll,
  createDefaultValue,
  createVoltage,
  createCurrent,
  createRecti,
};
