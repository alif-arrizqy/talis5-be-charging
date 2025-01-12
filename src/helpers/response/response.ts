export class ResponseHelper {
  public static success(data: any) {
    return {
      statusCode: 200,
      status: "success",
      data: data,
    };
  }

  public static successMessage(message: string, statusCode: number = 200) {
    return {
      statusCode: statusCode,
      status: "success",
      message: message,
    };
  }

  public static error(message: any, STATUS_CODES: number = 400) {
    return {
      statusCode: STATUS_CODES,
      status: "error",
      message: message,
    };
  }
}
