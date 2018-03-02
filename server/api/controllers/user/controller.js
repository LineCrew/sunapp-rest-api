import uuid from 'uuid/v4';
import {
  UserEntity,
  UserAnswerEntity,
  QuestionItemEntity,
  UserQuestionEntity,
  FriendEntity,
} from '../../entity/';
import { UserModel, StarModel, ApiResultModel } from '../../domain';
import sequelize from '../../../common/dbConfig';

/**
 * Controller of User Domain.
 */
class Controller {
  /**
   * 토큰 리프레쉬
   * @param {*} req
   * @param {*} res
   */
  async refreshAccessToken(req, res) {
    try {
      const targetUserEntity = await UserEntity.findOne(
        { where: { accessToken: req.body.currentToken } },
      );

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

      res.status(200).send(
        new ApiResultModel({ statusCode: 200, message: targetUserAnswerEntity }),
      );
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
   * ID 에 따른 회원 정보를 불러오는 함수
   * @param {*} req
   * @param {*} res
   */
  async getById(req, res) {
    try {
      const result = await UserEntity
        .findById(req.params.userId);

      res.status(200).send(new ApiResultModel({ statusCode: 500, message: result }));
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
    try {
      const starModel = new StarModel(req.body);
      const updatedUserEntity = await UserEntity.update({
        star: starModel.star,
      }, {
        where: {
          id: req.params.userId,
        },
      });

      res.status(200).send(new ApiResultModel({ statusCode: 200, message: starModel }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 500, message: e }));
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

      if (targetUserEntity.heart !== 0) {
        targetUserEntity.heart -= 2;
      } else if (targetUserEntity.heart === 0) {
        res.status(200).send(new ApiResultModel({ statusCode: 200, message: { currentHeart: 0 } }));
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
      const deletedUserEntity = await UserEntity.destroy({ where: { id: req.params.userId } });

      res.status(200).send(new ApiResultModel({
        statusCode: 200,
        message: deletedUserEntity,
      }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 200, message: e }));
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

      let syncedIds = [];
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
      res.send(new ApiResultModel({ statusCode: 200, message: targetFriendEntity }));
    } catch (e) {
      res.status(500).send(new ApiResultModel({ statusCode: 200, message: e }));      
    }
  }
}

export default new Controller();
