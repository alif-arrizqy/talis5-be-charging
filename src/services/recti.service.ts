import * as RectiDal from "../dal/recti.dal";
import * as RectiDto from "../dto/recti.dto";

export const getAll = async () => {
  return await RectiDal.getAll();
};

export const createRecti = async (payload: RectiDto.RectiInput) => {
  return await RectiDal.createRecti(payload);
}

export const createDefaultValue = async (): Promise<RectiDto.RectiOutput> => {
  return await RectiDal.createDefaultValue();
};

export const createVoltage = async (
  payload: RectiDto.RectiVoltageDto
): Promise<RectiDto.RectiVOltageOutput | null> => {
  return await RectiDal.createVoltage(payload);
};

export const createCurrent = async (
  payload: RectiDto.RectiCurrentDto
): Promise<RectiDto.RectiCurrentOutput | null> => {
  return await RectiDal.createCurrent(payload);
};
