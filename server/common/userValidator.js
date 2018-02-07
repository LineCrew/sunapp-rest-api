import UserEntity from '../api/entity/UserEntity';

export default (async (req, res, next) => {
  try {
    const result = await UserEntity
      .findOne({ where: { accessToken: req.get('accessToken') } });

    if (result === null) throw new Error('Invalid AccessToken');
    else next(result);
  } catch (e) {
    await res.status(500).send({ message: e.message });
  }
});
