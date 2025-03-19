import SocketModel, { ISocketDetails } from "@/models/socket.models";

class SocketDao {
  private socketModel = SocketModel;

  public createSocketDetails = async (payload: ISocketDetails) => {
    return await this.socketModel.create(payload);
  };

  public updateSocketDetails = async (payload: ISocketDetails) => {
    delete payload.user_id;
    return await this.socketModel.updateOne({user_id: payload.user_id}, payload);
  }

  public getSocketDetailsByUserId = async (userId: string) => {
    return await this.socketModel.findOne({ user_id: userId });
  };
}

export default SocketDao;
