import uuid from 'uuid/v4';
import {
  UserEntity,
  UserAnswerEntity,
  ReceiptEntity,
  QuestionItemEntity,
  UserQuestionEntity,
  FriendEntity,
} from '../../entity/';
import seoulMoment from '../../../common/seoulMoment';
import { UserModel, ApiResultModel } from '../../domain';
import redis from '../../../common/redisConfig';
import sequelize from '../../../common/dbConfig';
import l from '../../../common/logger';

const Op = sequelize.Op;

/**
 * Controller of User Domain.
 */
class Controller {

  async getMyScore(req, res) {
    try {
      const totalWinCount = await sequelize.query(`select count(*) from playingHistories where firstUserId = ${req.params.userId} and result = 'win'`);
      const totalLoseCount = await sequelize.query(`select count(*) from playingHistories where firstUserId = ${req.params.userId} and result = 'lose'`);
      const totalScoreCount = await sequelize.query(`select count(*) from answers where user_id = ${req.params.userId} and isCorrect = 1;`);

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: {
        totalWin: totalWinCount[0],
        totalLose: totalLoseCount[0],
        totalScore: totalScoreCount[0],
      } }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));      
    }
  }
  /**
   * @param {*} req
   * @param {*} res
   */
  async login(req, res) {
    try {
      const targetUserEntity = await UserEntity.findAll({
        where: {
          email: req.body.email,
          password: req.body.password,
          active: true,
        },
      });
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetUserEntity }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 토큰 리프레쉬
   * @param {*} req
   * @param {*} res
   */
  async refreshAccessToken(req, res) {
    try {
      const targetUserEntity = await UserEntity.findAll({ 
        where: { accessToken: req.body.currentToken },
      });

      targetUserEntity.accessToken = req.body.refreshToken;
      await targetUserEntity.save();

      res.status(200).send(new ApiResultModel({ statusCode: 200 }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }
  /**
   * 사용자가 잘못 답한 최근 문제 50개를 불러온다.
   * @param {*} req
   * @param {*} res
   */
  async getWrongAnswer(req, res) {
    try {
      const targetUserAnswerEntity = await UserAnswerEntity.findAll({
        include: [{
          model: UserEntity,
          as: 'user',
          where: { id: req.params.userId },
        }, {
          model: QuestionItemEntity,
          as: 'item',
        }],
        where: { isCorrect: false },
        order: [['created_at', 'DESC']],
        limit: 50,
      });

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetUserAnswerEntity }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * /user/:userId/answers
   * 사용자가 풀었던 문제들을 불러온다.
   * @param {*} req
   * @param {*} res
   */
  async getUserAnsweredList(req, res) {
    try {
      const targetUserEntity = await UserEntity.findById(req.params.userId, {
        include: [{
          model: UserAnswerEntity,
          as: 'userAnswers',
          include: {
            model: QuestionItemEntity,
            as: 'item',
          },
        }],
      });

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetUserEntity }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * User Update
   * @param {*} req
   * @param {*} res
   */
  async updateUserInfo(req, res) {
    try {
      const userModel = new UserModel(req.body);
      const result = await UserEntity.update(userModel, { where: { id: req.params.userId } });
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 사용자의 접속 기록을 레디스에 저장한다.
   * @param {*} req
   * @param {*} res
   */
  async updateConnectHistory(req, res) {
    try {
      const hashKey = `user-connect-${req.params.userId}`;
      const userEntity = await UserEntity.findById(req.params.userId);
      await redis.hmset(
        hashKey,
        [
          'userId', req.params.userId,
          'email', userEntity.email,
          'nickname', userEntity.nickname,
          'connected', seoulMoment().format('YYYY-MM-DD HH:MM:SS'),
        ], (err, res_) => {
          res.status(200).send(new ApiResultModel({ statusCode: 200, message: res_ }));
        },
      );
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * User 를 생성하는 함수
   * @param {*} req
   * @param {*} res
   */
  async post(req, res) {
    try {
      const userModel = new UserModel(req.body);

      if (userModel.loginType === 'signUp') {
        userModel.accessToken = uuid();
      }

      const result = await UserEntity.create(userModel);

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      console.log(e);
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 이메일 중복 여부 확인
   * @param {*} req
   * @param {*} res
   */
  async checkIdExists(req, res) {
    try {
      const result = await UserEntity.findOne({
        where: { email: req.body.email },
      });

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (error) {
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: error }));
    }
  }

  /**
   * 닉네임 중복 여부 확인
   * @param {*} req
   * @param {*} res
   */
  async checkNickNameExists(req, res) {
    try {
      const result = await UserEntity.findOne({
        where: { nickname: req.body.nickname },
      });

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (error) {
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: error }));
    }
  }

  /**
   * ID 에 따른 회원 정보를 불러오는 함수
   * @param {*} req
   * @param {*} res
   */
  async getById(req, res) {
    try {
      const result = await UserEntity
        .findById(req.params.userId);

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 모든 회원 정보를 불러오는 함수. 관리자 페이지 - 회원관리
   * @param {*} req
   * @param {*} res
   */
  async getAllUser(req, res) {
    try {
      const result = await UserEntity
        .findAll();

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: result }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * InApp 결제를 통하여, 별을 구매하는 API. 결제 로직은 클라이언트에서 진행하는 걸로 한다.
   * @param {*} req
   * @param {*} res
   */
  async buyStar(req, res) {
    const transaction = await sequelize.transaction();

    const receiptModel = {
      productName: req.body.productName,
      star: req.body.star,
      price: req.body.price,
    };

    try {
      const receiptEntity = await ReceiptEntity.create(receiptModel);
      const userEntity = await UserEntity.findById(req.params.userId, { transaction });
      receiptEntity.setUser(userEntity)
        .then(async result => {
          await UserEntity.update({
            star: userEntity.star + receiptModel.star,
          }, {
            where: {
              id: req.params.userId,
            },
          }, { transaction });
          const targetUserEntity = await UserEntity.findById(req.params.userId, { transaction });
          await transaction.commit();
          res.status(200).send(new ApiResultModel(
            { statusCode: 200, message: { result, targetUserEntity } },
          ));
        }).catch(async e => {
          await transaction.rollback();
          res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
        });
    } catch (e) {
      l.error(e);
      await transaction.rollback();
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * User 로서 하트를 사용한다.
   * @param {*} req
   * @param {*} res
   */
  async doHeart(req, res) {
    try {
      const userId = req.params.userId;
      const targetUserEntity = await UserEntity.findById(userId);
      
      const currentHeart = targetUserEntity.heart;

      if (currentHeart - 2 <= 0) {
        res.status(200).send(new ApiResultModel({ statusCode: 200, message: { status: false } }));
      } else if (targetUserEntity.heart === 0) {
        res.status(200).send(new ApiResultModel({ statusCode: 200, message: { currentHeart: 0 } }));
      } else {
        targetUserEntity.heart -= 1;
      }
      await targetUserEntity.save();

      res.status(200).send(new ApiResultModel(
        { statusCode: 200, message: { currentHeart: targetUserEntity.heart } }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 게임 플레이 도중 상대방과 나, 각각의 사용자 정보를 렌더링할 때 사용되는 API
   * @param {*} req
   * @param {*} res
   */
  async getPlayers(req, res) {
    try {
      const targetPlayersEntity = await Promise.all([
        UserEntity.findById(req.query.me),
        UserEntity.findById(req.query.opponent),
      ]);

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetPlayersEntity }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 사용자 질문 생성하기
   */
  async createUserQuestionEntity(req, res) {
    try {
      const generatedUserQuestionEntity = await UserQuestionEntity.create({
        content: req.body.content,
      });

      const targetUserEntity = await UserEntity.findById(req.body.userId);

      await generatedUserQuestionEntity.setUser(targetUserEntity);
      res.status(200).send(new ApiResultModel(
        { statusCode: 200, message: { generatedUserQuestionEntity, targetUserEntity } }),
      );
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 200, message: e }));
    }
  }

  /**
   * 모든 사용자 질문 목록 가져오기
   * @param {*} req
   * @param {*} res
   */
  async getUserQuestionEntity(req, res) {
    try {
      const targetUserQuestionEntities = await UserQuestionEntity.findAll({
        include: {
          model: UserEntity,
          as: 'user',
        },
      });

      res.status(200).send(new ApiResultModel(
        { statusCode: 200, message: targetUserQuestionEntities },
      ));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 200, message: e }));
    }
  }

  /**
   * 회원 탈퇴
   * @param {*} req
   * @param {*} res
   */
  async userWithdrawal(req, res) {
    try {
      const userEntity = await UserEntity.findById(req.params.userId);
      userEntity.active = false;
      userEntity.deletedAt = seoulMoment().format('YYYY-MM-DD HH:mm:ss');
      await userEntity.save();

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: 'SUCCESS' }));
      // console.log(userEntity)

      // await UserEntity.destroy({ where: { id: req.params.userId } });

      // redis.hmset(
      //   `user-withdrawal-${req.params.userId}`,
      //   [
      //     'userId', userEntity.id,
      //     'email', userEntity.email,
      //     'nickname', userEntity.nickname,
      //     'connected', seoulMoment().format('YYYY-MM-DD HH:MM:SS'),
      //   ], (err, res_) => {
      //     res.status(200).send(new ApiResultModel({ statusCode: 200, message: userEntity }));
      //   },
      // );
    } catch (e) {
      l.error(e);
      res.status(500).send(new ApiResultModel({ statusCode: 200, message: e }));
    }
  }

  /**
   * 탈퇴 기록 조회
   * @param {*} req
   * @param {*} res
   */
  async userWithDrawalHistory(req, res) {
    try {
      if (!req.body.startDate && !req.body.endDate) {
        const userEntity = await UserEntity.findAll({
          where: {
            active: false,
          },
        });

        res.status(200).send(new ApiResultModel({ statusCode: 200, message: userEntity }));
      } else {
        const userEntity = await UserEntity.findAll({
          where: {
            active: false,
            deletedAt: {
              [Op.lt]: new Date(req.body.endDate),
              [Op.gte]: new Date(req.body.startDate),
            },
          },
        });

        res.status(200).send(new ApiResultModel({ statusCode: 200, message: userEntity }));
      }
    } catch (e) {
      l.error(e);
    }
  }

  /**
   * 페이스북 친구를 연동한다.
   * @param {*} req
   * @param {*} res
   */
  async syncFacebookFriends(req, res) {
    try {
      const targetUserEntity = await UserEntity.findById(req.params.userId);
      const syncedFriendEntity = await sequelize.query(`select friendId from friends where userId = ${req.params.userId}`);

      const syncedIds = [];
      syncedFriendEntity[0].forEach(e => syncedIds.push(e.friendId));

      if (syncedIds.length !== syncedFriendEntity[0].length) {
        const targetFriendsUserEntities = await sequelize.query(`select * from users where facebookUserId in(${req.body.facebookUserIds.toString()}) and facebookUserId not in(${syncedIds.toString()})`);

        targetFriendsUserEntities[0].forEach(async e => {
          const generatedFriendEntity = await FriendEntity.create();
          await generatedFriendEntity.setUser(targetUserEntity);
          await generatedFriendEntity.setFriend(new UserEntity(e));

          const response = await FriendEntity.findAll({
            where: { userId: req.params.userId },
            include: {
              model: UserEntity,
              as: 'friend',
            },
          });
          res.status(200).send(new ApiResultModel({ statusCode: 200, message: response }));
        });
      } else if (syncedIds.length === syncedFriendEntity[0].length) {
        res.send(new ApiResultModel({ statusCode: 200, message: 'SYNCING_IS_ALREADY_DONE' }));
      }
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 200, message: e }));
    }
  }

  /**
   * 친구 목록 조회
   * @param {*} req
   * @param {*} res
   */
  async getFriends(req, res) {
    try {
      const targetFriendEntity = await FriendEntity.findAll({
        include: {
          model: UserEntity,
          as: 'user',
          where: { id: req.params.userId },
        },
      });
      res.status(200).send(new ApiResultModel({ statusCode: 200, message: targetFriendEntity }));
    } catch (e) {
      res.status(200).send(new ApiResultModel({ statusCode: 500, message: e }));
    }
  }

  /**
   * 사용자의 메시지 함을 조회한다.
   * @param {*} req
   * @param {*} res
   */
  async getNotificationMessages(req, res) {
    try {
      // const notifications = await redis.hgetall(`user-notification-${req.params.userId}`);
      redis.lrange(`user-notification-${req.params.userId}`, 0, -1, (err, obj) => {
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
