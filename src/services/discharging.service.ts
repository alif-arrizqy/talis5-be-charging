import * as DischargingDal from "../dal/discharging.dal";

export const createLogDischarging = async (data: any): Promise<{}> => {
  return await DischargingDal.createLogDischarging(data);
};

export const getByPackBarcode = async (packBarcode: string): Promise<{}> => {
  return await DischargingDal.getByPackBarcode(packBarcode);
};

export const getByPcbBarcode = async (pcbBarcode: string): Promise<{}> => {
  return await DischargingDal.getByPcbBarcode(pcbBarcode);
};
