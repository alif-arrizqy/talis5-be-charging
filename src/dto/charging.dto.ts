export interface IDataItem {
  data: IData[];
}

export interface IData {
  pcb_barcode: string;
  sn_code_1: string;
  sn_code_2: string;
  warning_flag: any;
  protection_flag: any;
  fault_status_flag: any;
  pack_voltage: { value: number };
  pack_current: { value: number };
  remaining_capacity: { value: number };
  average_cell_temperature: { value: number };
  env_temperature: { value: number };
  soc: { value: number };
  soh: { value: number };
  full_charged_cap: { value: number };
  cycle_count: { value: number };
  cell_voltage: { value: number[] };
  max_cell_voltage: { value: number };
  min_cell_voltage: { value: number };
  cell_voltage_diff: { value: number };
  max_cell_temperature: { value: number };
  min_cell_temperature: { value: number };
  fet_temperature: { value: number };
  cell_temperature: { value: number[] };
  ambient_temperature: { value: number };
  remaining_charge_time: { value: number };
  remaining_discharge_time: { value: number };
}

export interface IStoreLog {
  pcb_barcode: string;
  voltage: number;
  current: number;
  remaining_capacity: number;
  average_cell_temperature: number;
  env_temperature: number;
  warning_flag: any;
  protection_flag: any;
  fault_status_flag: any;
  soc: number;
  soh: number;
  full_charged_cap: number;
  cycle_count: number;
  cell_voltage_1: number;
  cell_voltage_2: number;
  cell_voltage_3: number;
  cell_voltage_4: number;
  cell_voltage_5: number;
  cell_voltage_6: number;
  cell_voltage_7: number;
  cell_voltage_8: number;
  cell_voltage_9: number;
  cell_voltage_10: number;
  cell_voltage_11: number;
  cell_voltage_12: number;
  cell_voltage_13: number;
  cell_voltage_14: number;
  cell_voltage_15: number;
  cell_voltage_16: number;
  max_cell_voltage: number;
  min_cell_voltage: number;
  cell_voltage_diff: number;
  max_cell_temperature: number;
  min_cell_temperature: number;
  fet_temperature: number;
  cell_temperature_1: number;
  cell_temperature_2: number;
  cell_temperature_3: number;
  cell_temperature_4: number;
  ambient_temperature: number;
  remaining_charge_time: number;
  remaining_discharge_time: number;
}

export interface IMasterFrame {
  pcb_barcode: string;
  sn_code_1: string;
  sn_code_2: string;
  charging?: boolean;
}

export interface IFrameHistory {
  pcb_barcode: string;
  voltage?: number;
  current?: number;
  remaining_capacity?: number;
  soc?: number;
  soh?: number;
  max_cell_voltage?: number;
  min_cell_voltage?: number;
  cell_voltage_diff?: number;
  max_cell_temperature?: number;
  min_cell_temperature?: number;
  remaining_charge_time?: number;
  remaining_discharge_time?: number;
  charging?: boolean;
  start_time?: string;
  end_time?: string;
  charging_time?: string;
}

export interface IStoreLogOutput {}
export interface IMasterFrameOutput {}
export interface IFrameHistoryOutput {}