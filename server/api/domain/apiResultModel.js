export default class ApiResultModel {
  constructor(data = {}) {
    this.statusCode = data.statusCode;
    this.message = data.message;
  }
}
