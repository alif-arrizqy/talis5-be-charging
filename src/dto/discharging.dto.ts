export interface IDataItem {
  data: IData[];
}

export interface IData {
  address: number;
  rxtx: string;
  pcb_barcode: string;
  pack_barcode: string;
  date_time: string;
  cell_count: number;
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
  total_voltage: number;
  current: number;
  full_capacity: number;
  remaining_capacity: number;
  all_chg_ah: number;
  all_dsg_ah: number;
  all_chg_time: number;
  all_dsg_time: number;
  all_chg_kwh: number;
  all_dsg_kwh: number;
  soc: number;
  soh: number;
  temperature_count: number;
  cell_temperature_1: number;
  cell_temperature_2: number;
  cell_temperature_3: number;
  cell_temperature_4: number;
  mos_temp: number;
  amb_temp: number;
  status_code: string;
  status_log: string;
}
