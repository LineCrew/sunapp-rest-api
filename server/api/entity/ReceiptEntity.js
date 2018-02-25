import { DataTypes } from 'sequelize';
import sequelize from '../../common/dbConfig';

// '{
//   "orderId":"GPA.1234-5678-9012-34567",
//   "packageName":"com.example.app",
//   "productId":"exampleSku",
//   "purchaseTime":1345678900000,
//   "purchaseState":0,
//   "developerPayload":"bGoa+V7g/yqDXvKRqq+JTFn4uQZbPiQJo4pf9RzJ",
//   "purchaseToken":"opaque-token-up-to-1000-characters"
// }'
const receiptEntity = sequelize.define('receipts', {
  orderId: { type: DataTypes.STRING },
  packageName: { type: DataTypes.STRING },
  productId: { type: DataTypes.INTEGER },
  price: { type: DataTypes.INTEGER },
  purchaseTime: { type: DataTypes.INTEGER },
  purchaseState: { type: DataTypes.INTEGER },
  developerPayload: { type: DataTypes.STRING },
  purchaseToken: { type: DataTypes.STRING },
});

export default receiptEntity;
