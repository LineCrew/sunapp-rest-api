export default class AdvertiseModel {
/**
   * 광고순서, 광고주, 광고내용, 지급할 별, 광고URL링크
   * @param {*} data
   */
  constructor(data = {}) {
    this.order = data.order;
    this.advertiser = data.advertiser;
    this.content = data.content;
    this.star = data.star;
    this.link = data.link;
  }
}

