export default class AnswerModel {
  constructor(data = {}) {
    this.questionItemId = data.questionItemId;
    this.answer = data.answer;
    this.gameType = data.gameType;
    this.elapsedTime = data.elapsedTime;
  }
}
