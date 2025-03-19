import CommunicationService from "@/services/communication.service";
import UserDao from "@/dao/user.dao";
import SocketDao from "@/dao/socket.dao";
import { Server } from "socket.io";
import moment from "moment";
import { InhouseSocket } from "@/types/socket";

export interface ISocketEvent {
  eventName: string;
  io: Server;
  socket: InhouseSocket;
}

class SocketEvents {
  private io: Server;
  private communicationService = new CommunicationService();

  // Daos
  private socketDao = new SocketDao();

  public initializeSocketEvents(payload: ISocketEvent) {
    const { eventName, socket, io } = payload;
    this.io = io;

    switch (eventName) {
      case "init":
        return async (payload: string) => {
          const parsedPayload = JSON.parse(payload);
          const { user_id, fingerprint_id } = parsedPayload;
          if (!user_id || !fingerprint_id) {
            return;
          }

          console.log("SOCKET ID>>>>>>>>>", socket.id, user_id);

          // await this.socketDao.createSocketDetails({
          //   user_id,
          //   socket_id: socket.id,
          //   device_fingerprint_id: fingerprint_id,
          // })
        };
      case "new-chat-message":
        return this.addNewChatMessage;
      case "disconnect":
        return () => {
          console.log("LOGS>>>>>>>>>>>>>>>>");
        };
      default:
        return () => {
          console.log("Invalid Event Raised");
        };
    }
  }

  private addNewChatMessage = async (payload: string) => {
    const parsedPayload = JSON.parse(payload);
    const { sender_id, receiver_id, message } = parsedPayload;

    if (sender_id && receiver_id && message) {

      const [receiverSocketDetails] = await Promise.all([
        this.socketDao.getSocketDetailsByUserId(receiver_id),
        // this.communicationService.createChat({
        //   senderId: sender_id,
        //   receiverId: receiver_id,
        //   message,
        // }),
      ]);

      console.log("RECEIVE SD>>>>>>>", receiverSocketDetails);

      this.io.to(receiverSocketDetails?.socket_id).emit("received-user-chat", {
        user_id: sender_id,
        message,
        created_at: moment.utc().format("hh:mm a"),
      });
    }
  };
}

export default SocketEvents;
