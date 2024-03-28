import * as ChargingDal from '../dal/charging.dal';
import * as ChargingDto from '../dto/charging.dto';

export const getAllMasterFrame = async (): Promise<ChargingDto.IMasterFrame[]> => {
  return await ChargingDal.getAllMasterFrame();
}

export const getMasterFrame = async (
  pcb_barcode: string
): Promise<ChargingDto.IMasterFrameOutput> => {
  return await ChargingDal.getMasterFrame(pcb_barcode);
}

export const createMasterFrame = async (
  payload: any
): Promise<ChargingDto.IMasterFrameOutput> => {
  return await ChargingDal.createMasterFrame(payload);
}

export const createLogData = async (
  payload: any
): Promise<ChargingDto.IStoreLogOutput> => {
  return await ChargingDal.createLogData(payload);
}

export const getAllFrameHistory = async (): Promise<ChargingDto.IFrameHistoryOutput[]> => {
  return await ChargingDal.getAllFrameHistory();
}

export const getFrameHistory = async (
  pcb_barcode: string
): Promise<ChargingDto.IFrameHistoryOutput> => {
  return await ChargingDal.getFrameHistory(pcb_barcode);
}

export const updateFrameHistory = async (
  payload: any
): Promise<ChargingDto.IFrameHistoryOutput> => {
  return await ChargingDal.updateFrameHistory(payload);
}
