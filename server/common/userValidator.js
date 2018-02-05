import UserEntity from '../api/entity/UserEntity';
import DBService from '../api/services/DbService';

export default (async (req, res, next) => {
  try {
    const result = await new DBService(UserEntity)
      .find({ where: { accessToken: req.get('accessToken') } });

    if (result === null) throw new Error('Invalid AccessToken');
    else next(result);
  } catch (e) {
    await res.status(500).send({ message: e.message });
  }
});
