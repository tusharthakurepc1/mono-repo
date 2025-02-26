import { IUser } from "@/interfaces/user.interface";
import UsersModel from "@/models/user.model";
import { MAX_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants/enum";

class UserDao {
  private userModel = UsersModel;

  // Get the user by email id
  public getUserByEmail = async (email: string): Promise<IUser> => {
    return await this.userModel.findOne({ email });
  };

  // Get the users by userId
  public getUserByUserId = async (userId: string, fields: string[] = []) => {
    return await this.userModel.findOne({ _id: userId });
  };

  // Get the users by userIds
  public getUserByUserIds = async (
    userIds: string[],
    fields: string[] = []
  ) => {
    return await this.userModel.find({ _id: { $in: userIds } }).select(fields);
  };

  // Get all the user expect from the source
  public getUsers = async (email: string) => {
    return await this.userModel.find({ email: { $ne: email } });
  };

  // Get community paginated user list
  public getPaginatedNewUsers = async (payload: {
    filter: object;
    pagination: { page: number; limit: number };
  }) => {
    const { page, limit: pageSize } = payload.pagination;

    const [response, count] = await Promise.all([
      this.userModel
        .find(payload.filter)
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      this.userModel.countDocuments(payload.filter),
    ]);

    return { response, count };
  };

  // Add friend id into the requested friend list
  public addUserFriendRequest = async (userId: string, friendId: string) => {
    return await this.userModel.updateOne(
      {
        _id: userId,
      },
      {
        $addToSet: {
          requested_friends_ids: friendId,
        },
        $pull: {
          friends_ids: friendId,
          blocked_ids: friendId,
        },
      }
    );
  };

  // Add the friend id into the friend list
  public addUserFriendList = async (userId: string, friendId: string) => {
    return await this.userModel.updateOne(
      {
        _id: userId,
      },
      {
        $addToSet: {
          friends_ids: friendId,
        },
        $pull: {
          blocked_ids: friendId,
          requested_friends_ids: friendId,
        },
      }
    );
  };

  // Add the friend id into the blocked list
  public addUserBlockedList = async (userId: string, friendId: string) => {
    return await this.userModel.updateOne(
      {
        _id: userId,
      },
      {
        $addToSet: {
          blocked_ids: friendId,
        },
        $pull: {
          requested_friends_ids: friendId,
          friends_ids: friendId,
        },
      }
    );
  };
}

export default UserDao;
