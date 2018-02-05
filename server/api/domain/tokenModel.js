export default class TokenModel {
  constructor(data = {}) {
    this.currentToken = data.currentToken;
    this.refreshToken = data.refreshToken;
  }
}
