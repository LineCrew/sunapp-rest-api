export default class QuestionItemModel {
  constructor(data = {}) {
    this.questionaireId = data.questionaireId;
    this.number = data.number;
    this.content = data.content;
    this.example = data.example;
    this.case1 = data.case1;
    this.case2 = data.case2;
    this.case3 = data.case3;
    this.case4 = data.case4;
    this.case5 = data.case5;
    this.answer = data.answer;
  }
}
