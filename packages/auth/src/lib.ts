export class CustomError extends Error {
    public data: null;
    public success: boolean;
    constructor(public statusCode: number, message: string) {
      super(message);
      this.success = false;
      this.data = null;
      this.name = "CustomError";
      Error.captureStackTrace(this, this.constructor);
    }
}

export class ApiResponse {
    public success: boolean;
    constructor(
      public statusCode: number,
      public message: string,
      public data: any
    ) {
      this.success = statusCode < 400;
    }
  }