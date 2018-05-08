/**
 * StarModel
 * 인앱 결제를 통하여 Star 를 구매할 때, 몇 개의 별을 구매하는지 받아오는 모델
 * TODO: 어떠한 기록을 남길지에 대한 정의를 받아야 함.
 */

export default class StarModel {
  constructor(data = {}) {
    this.userId = data.userId;
    this.star = data.star;

    if (typeof (this.star) !== 'number') throw new Error('Invalid Type');
  }
}
