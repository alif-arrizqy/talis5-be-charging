import {IDataItem} from "../../dto/charging.dto"

function createResultObject(values: number[], prefix: string, start: number = 0): { [key: string]: number } {
  let result: { [key: string]: number } = {};
  for (let i = start; i < values.length; i++) {
    result[`${prefix}${i + 1}`] = values[i];
  }
  return result;
}

const dataCleaning = (data: IDataItem[]) => {
  return data.map((item) => {
    const {
      pcb_barcode,
      sn_code_1,
      sn_code_2,
      warning_flag,
      protection_flag,
      fault_status_flag,
      pack_voltage: { value: pack_voltage },
      pack_current: { value: pack_current },
      remaining_capacity: { value: remaining_capacity },
      average_cell_temperature: { value: average_cell_temperature },
      env_temperature: { value: env_temperature },
      soc: { value: soc },
      soh: { value: soh },
      full_charged_cap: { value: full_charged_cap },
      cycle_count: { value: cycle_count },
      cell_voltage: { value: cell_voltage },
      max_cell_voltage: { value: max_cell_voltage },
      min_cell_voltage: { value: min_cell_voltage },
      cell_voltage_diff: { value: cell_voltage_diff },
      max_cell_temperature: { value: max_cell_temperature },
      min_cell_temperature: { value: min_cell_temperature },
      fet_temperature: { value: fet_temperature },
      cell_temperature: { value: cell_temperature },
      ambient_temperature: { value: ambient_temperature },
      remaining_charge_time: { value: remaining_charge_time },
      remaining_discharge_time: { value: remaining_discharge_time },
    } = item;

    let cell_voltage_result = createResultObject(cell_voltage, 'cell_voltage');
    let cell_temperature_result = createResultObject(cell_temperature, 'cell_temperature');

    return {
      pcb_barcode,
      sn_code_1,
      sn_code_2,
      pack_voltage,
      pack_current,
      remaining_capacity,
      average_cell_temperature,
      env_temperature,
      warning_flag,
      protection_flag,
      fault_status_flag,
      soc,
      soh,
      full_charged_cap,
      cycle_count,
      ...cell_voltage_result,
      max_cell_voltage,
      min_cell_voltage,
      cell_voltage_diff,
      max_cell_temperature,
      min_cell_temperature,
      fet_temperature,
      ...cell_temperature_result,
      ambient_temperature,
      remaining_charge_time,
      remaining_discharge_time,
    };
  });
};

export { dataCleaning };
