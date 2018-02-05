export default class UserModel {
  constructor(data = {}) {
    this.nickname = data.nickname;
    this.accessToken = data.accessToken;
    this.loginType = data.loginType;
    this.facebookUserId = data.facebookUserId;
    this.registrationId = data.registrationId;
    this.character = data.character;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.gender = data.gender;
    this.birth = data.birth;
    this.address = data.address;
    this.phone = data.phone;
    // if (this.username === undefined || this.accessToken === undefined ||) {     
    // }
  }
}
