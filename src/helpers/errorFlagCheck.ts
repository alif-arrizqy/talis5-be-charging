import ParsingErrorType from "./parseErrorType";

const parseErrorType = new ParsingErrorType();

export class CheckErrorLog {
  async warningFlagCheck(item: any) {
    const warning = Object.keys(item.warning_flag).filter((key) => {
      return key !== "unit" && key !== "value" && item.warning_flag[key] === 1;
    });
    return await parseErrorType.parseWarningFlag(warning);
  }

  protectionFlagCheck(item: any) {
    const protectionFlag = Object.keys(item.protection_flag).filter((key) => {
      return key !== "unit" && key !== "value" && item.protection_flag[key] === 1;
    });
    return parseErrorType.parseProtectionFlag(protectionFlag);
  }

  faultStatusFlagCheck(item: any) {
  const faultStatusFlag = Object.keys(item.fault_status_flag).filter((key) => {
    if (key === "comm_sampling_fault" || key === "temp_sensor_break") return item.fault_status_flag[key] === 1;
  });
  return parseErrorType.parseFaultFlag(faultStatusFlag);
}
}