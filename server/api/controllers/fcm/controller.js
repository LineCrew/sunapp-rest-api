import * as admin from 'firebase-admin';

const serviceAccount = require('');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * FCM Controller
 */
class Controller {


}

export default new Controller();
