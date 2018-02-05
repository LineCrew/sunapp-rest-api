export default class FaqModel {
  constructor(data = {}) {
    this.topic = data.topic;
    this.question = data.question;
    this.answer = data.answer;
  }
}
