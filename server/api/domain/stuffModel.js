export default class StuffModel {
  constructor(data = {}) {
    this.subject = data.subject;
    this.imageUrl = data.imageUrl;
    this.description = data.description;
    this.isActive = data.isActive;
  }
}
