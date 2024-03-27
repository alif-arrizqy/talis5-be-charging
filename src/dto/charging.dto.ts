export interface IDataItem {
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
