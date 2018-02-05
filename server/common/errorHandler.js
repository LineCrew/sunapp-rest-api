import l from './logger';
import { Model, Error } from 'sequelize';

export default (err, req, res, next) => {
  // l.error(err);
  // console.log(err.name)
  // res.status(200).send({a : err.code});
  console.log(err)
  next(res.send(err));
};
