class apiResponse {
  constructor(stateCode, data, message = "Success") {
    this.stateCode = stateCode;
    this.data = data;
    this.message = message;
    this.success = stateCode < 400;
  }
}

export { apiResponse };
