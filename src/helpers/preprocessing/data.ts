import {IDataItem} from "../../dto/charging.dto"

function createResultObject(values: number[], prefix: string, start: number = 0): { [key: string]: number } {
  let result: { [key: string]: number } = {};
  for (let i = start; i < values.length; i++) {
    result[`${prefix}${i + 1}`] = values[i];
  }
  return result;
}

const dataCleaning = (data: IDataItem) => {
  return data.data.map((item: any) => {
    return {
      pcb_barcode: item.pcb_barcode,
      sn_code_1: item.sn_code_1,
      sn_code_2: item.sn_code_2,
      warning_flag: item.warning_flag,
      protection_flag: item.protection_flag,
      fault_status_flag: item.fault_status_flag,
      voltage: item.pack_voltage.value,
      current: item.pack_current.value,
      remaining_capacity: item.remaining_capacity.value,
      average_cell_temperature: item.average_cell_temperature.value,
      env_temperature: item.env_temperature.value,
      soc: item.soc.value,
      soh: item.soh.value,
      full_charged_cap: item.full_charged_cap.value,
      cycle_count: item.cycle_count.value,
      ...createResultObject(item.cell_voltage.value, "cell_voltage_"),
      max_cell_voltage: item.max_cell_voltage.value,
      min_cell_voltage: item.min_cell_voltage.value,
      cell_voltage_diff: item.cell_voltage_diff.value,
      max_cell_temperature: item.max_cell_temperature.value,
      min_cell_temperature: item.min_cell_temperature.value,
      fet_temperature: item.fet_temperature.value,
      ...createResultObject(item.cell_temperature.value, "cell_temperature_"),
      ambient_temperature: item.ambient_temperature.value,
      remaining_charge_time: item.remaining_charge_time.value,
      remaining_discharge_time: item.remaining_discharge_time.value,
    };
  });
}

export { dataCleaning };
