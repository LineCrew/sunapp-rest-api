import * as admin from 'firebase-admin';
import sequelize from '../../../common/dbConfig';
import redis from '../../../common/redisConfig';
import { UserEntity } from '../../entity';

const serviceAccount = require('./serviceKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sunapp-94c0c.firebaseio.com',
});

/**
 * FCM Controller
 */
class Controller {
  /**
   * 모든 디바이스에 FCM 메시지를 전송한다.
   * @param {*} req
   * @param {*} res
   */
  async sendToAllDevice(req, res) {
    try {
      const targetUserRegistrationIds = await sequelize.query('select id, registrationId from users;');
      const registrationIds = [];
      const userIds = [];

      /**
       * notification: {
       *  title: title,
       *  body: body
       * }
       */
      const payload = {
        notification: req.body,
      };

      targetUserRegistrationIds[0].forEach(e => {
        if (e.registrationId !== null) {
          userIds.push(e.id);
          registrationIds.push(e.registrationId);
        }
      });

      if (registrationIds.length === 0) res.send({ message: 'NO_REGISTRATION_IDS' });
      else {
        const result = await admin.messaging().sendToDevice(registrationIds, payload);
        userIds.forEach(async id => {
          redis.lpush(`user-notification-${id}`, payload.toString());
          await redis.expire(`user-notification-${id}`, 60 * 60 * 24); // 하루 동안 보관
        });

        res.send(result);
      }
    } catch (e) {
      res.send(e);
    }
  }

  /**
   * 특정 기기에 FCM 메시지를 전송한다.
   * @param {*} req
   * @param {*} res
   */
  async sendToDevice(req, res) {
    try {
      const targetUserEntity = await UserEntity.findById(req.params.userId);

      /**
       * notification: {
       *  title: title,
       *  body: body
       * }
       */
      const payload = {
        notification: req.body,
      };

      if (targetUserEntity.registrationId === null) res.send({ message: 'NO_REGISTRATION_IDS' });
      else {
        const result = await admin.messaging().sendToDevice(targetUserEntity.registrationId, payload);
        redis.lpush(`user-notification-${targetUserEntity.id}`, payload.toString());
        await redis.expire(`user-notification-${targetUserEntity.id}`, 60 * 60 * 24); // 하루 동안 보관
        res.send(result);
      }
    } catch (e) {
      res.send(e);
    }
  }
}

export default new Controller();
