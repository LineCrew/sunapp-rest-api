import * as admin from 'firebase-admin';
import sequelize from '../../../common/dbConfig';
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
      const targetUserRegistrationIds = await sequelize.query('select registrationId from users;');
      const registrationIds = [];

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
        if (e.registrationId !== null) registrationIds.push(e.registrationId);
      });

      if (registrationIds.length === 0) res.send({ message: 'NO_REGISTRATION_IDS' });
      else {
        admin.messaging().sendToDevice(registrationIds, payload)
          .then(response => {
            console.log('Successfully sent message: ', response);
            res.send(response);
          })
          .catch(e => {
            console.log('Error sending message: ', e);
            res.send(e);
          });
      }
    } catch (e) {
      console.log(e);
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
        admin.messaging().sendToDevice(targetUserEntity.registrationId, payload)
          .then(response => {
            console.log('Successfully sent message: ', response);
            res.send(response);
          })
          .catch(e => {
            console.log('Error sending message: ', e);
            res.send(e);
          });
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default new Controller();
