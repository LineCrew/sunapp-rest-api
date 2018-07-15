/**
 * 관리자 계정 모델
 */

export default class AdministratorModel {
  constructor(data = {}) {
    this.account = data.account;
    this.name = data.name;
    this.company = data.company;
    this.type = data.type;
    this.password = data.password;
  }
}
