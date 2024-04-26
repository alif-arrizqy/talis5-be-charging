class ParsingErrorType {
  parseWarningFlag = async (warningFlags: string[]) => {
    return warningFlags.map((item: string) => {
      if (item === "cell_ov_alm") return "Cell Overvoltage Alarm";
      if (item === "cell_uv_alm") return "Cell Undervoltage Alarm";
      if (item === "pack_ov_alm") return "Pack Overvoltage Alarm";
      if (item === "pack_uv_alm") return "Pack Undervoltage Alarm";
      if (item === "chg_oc_alm") return "Charge Overcurrent Alarm";
      if (item === "dhcg_oc_alm") return "Discharge Overcurrent Alarm";
      if (item === "bat_ot_alm") return "Battery Overtemperature Alarm";
      if (item === "bat_ut_alm") return "Battery Undertemperature Alarm";
      if (item === "env_ot_alm") return "Environment Overtemperature Alarm";
      if (item === "env_ut_alm") return "Environment Undertemperature Alarm";
      if (item === "mos_ot_alm") return "Mosfet Overtemperature Alarm";
      if (item === "low_capacity") return "Low Capacity Alarm";
      return item;
    });
  }

  parseProtectionFlag = async (protectionFlags: string[]) => {
    return protectionFlags.map((item: string) => {
      if (item === "cell_ov_prot") return "Cell Overvoltage Protection";
      if (item === "cell_uv_prot") return "Cell Undervoltage Protection";
      if (item === "pack_ov_prot") return "Pack Overvoltage Protection";
      if (item === "pack_uv_prot") return "Pack Undervoltage Protection";
      if (item === "short_prot") return "Short Protection";
      if (item === "oc_prot") return "Overcurrent Protection";
      if (item === "chg_ot_prot") return "Charge Overtemperature Protection";
      if (item === "chg_ut_prot") return "Charge Undertemperature Protection";
      if (item === "dhcg_ot_prot") return "Discharge Overtemperature Protection";
      if (item === "dchg_ut_prot") return "Discharge Undertemperature Protection";
    })
  }

  parseFaultFlag = async (faultFlags: string[]) => {
    return faultFlags.map((item: string) => {
      if (item === "comm_sampling_fault") return "Communication Sampling Fault";
      if (item === "temp_sensor_break") return "Temperature Sensor Break";
    });
  }
}

export default ParsingErrorType;
