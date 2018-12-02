export default class ReceiptModel {
  constructor(data = {}) {
    this.productName = data.productName;
    this.price = data.price;
    this.star = data.star;
  }
}
