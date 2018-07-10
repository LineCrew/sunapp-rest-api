/**
 * 이벤트 상품에 대한 도메인 모델
 * 이번 주와, 다음 주에 선물할 상품 사진
 * isActive 는 활성화 여부이며
 * description 은 2018년 1월 1주차... 등의 운영 상의 설명을 위하여 추가.
 */
export default class StuffModel {
  constructor(data = {}) {
    this.eventImage = data.eventImage;
    this.active = data.active;
    this.status = data.status
    this.description = data.description;
  }
}
