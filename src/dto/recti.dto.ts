export interface RectiInput {
  maxVoltageCell: number;
  minVoltageCell: number;
  totalCell: number;
  current: number;
}

export interface RectiDto {
  voltage: number;
  current: number;
}

export interface RectiVoltageDto {
  maxVoltageCell: number;
  minVoltageCell: number;
  totalCell: number;
}

export interface RectiCurrentDto {
  current: number;
}

export interface RectiOutput {}
export interface RectiVOltageOutput {}
export interface RectiCurrentOutput {}
