export default class GamePlayingRequestModel {
  /**
   * 게임 플레잉 타입과 문제지 나, 그리고 상대방 유저.
   * @param {*} data
   */
  constructor(data = {}) {
    this.userPlayingType = data.userPlayingType;
    this.questionaireId = data.questionaireId;
    this.userId = data.userId;
    this.opponentUserId = data.opponentUserId;
  }
}
