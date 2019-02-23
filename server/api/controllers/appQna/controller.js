import { ProblemEntity } from '../../entity/';
import { ApiResultModel } from '../../domain';
import fs from 'fs';
import * as path from 'path';
import redis from '../../../common/redisConfig';

/**
 * Problem Controller
 */

class Controller {
  /**
   * 문제 신고 엔티티 생성 API
   * @param {*} req
   * @param {*} res
   */
  async createProblem(req, res) {
    try {
      const destination = `${req.files.appImage.fieldname}-${Date.now()}.${req.files.appImage.extension}`;

      const result = await ProblemEntity.create({
        question: req.query.question,
        email: req.query.email,
        uploadFile: destination,
      });

      fs.readFile(req.files.appImage.path, async (err, data) => {
        fs.writeFile(path.join(`./public/uploads/${destination}`), data, async e => {
          if (err) res.status(500).send(new ApiResultModel({ statusCode: 500, e }));
          else {
            res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
          }
        });
      });
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 문제 신고 정보 불러오기
   * @param {*} req
   * @param {*} res
   */
  async getProblems(req, res) {
    try {
      const result = await ProblemEntity.findAll();
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 문의 답변 불러오기
   * @param {*} req
   * @param {*} res
   */
  async getProblemAnswer(req, res) {
    try {
      redis.lrange(`user-problem-answer-${req.params.userId}`, 0, -1, (err, obj) => {
        res.status(200).send(new ApiResultModel({
          statusCode: 200,
          message: obj,
        }));
      });
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }
}

export default new Controller();
