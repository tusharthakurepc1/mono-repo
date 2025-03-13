import CommunicationService from "@/services/communication.service";
import UserDao from "@/dao/user.dao";
import { Server, Socket } from "socket.io";
import moment from "moment";

export interface ISocketEvent {
  eventName: string;
  io: Server;
  socket: Socket;
}

class SocketEvents {
  private io: Server;
  private communicationService = new CommunicationService();
  private usersSocketHash = new Map();

  private userDao = new UserDao();

  public initializeSocketEvents(payload: ISocketEvent) {
    const { eventName, socket, io } = payload;
    this.io = io;

    switch (eventName) {
      case "init":
        return async (payload: string) => {
          // Update the socket.id with the fingerprint id of system and store in the db
          // If fingerprint not found then add otherwise pass
          const parsedPayload = JSON.parse(payload);
          const { user_id, visitor_id } = parsedPayload;
          if (!user_id || !visitor_id) {
            return;
          }

          const response = await this.userDao.getSocketDetails(parsedPayload);
          if (!response) {
            // Assign a new socket with fingerprint details
            await this.userDao.addSocketByDeviceFingerprint({
              user_id,
              visitor_id,
              socket_id: socket.id,
            });
          } else {
            // Update the socket details with existing fingerprint details
            await this.userDao.updateSocketByDeviceFingerprint({
              user_id,
              visitor_id,
              socket_id: socket.id,
            });
          }
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
    const { sender_id, receiver_id, message, visitor_id } = parsedPayload;
    console.log(parsedPayload);

    if (sender_id && receiver_id && message) {
      // await this.communicationService.createChat({
      //   senderId: sender_id,
      //   receiverId: receiver_id,
      //   message,
      // });

      const receiverSocketId = this.usersSocketHash.get(receiver_id);
      this.io.to(receiverSocketId).emit("received-user-chat", {
        user_id: sender_id,
        message,
        created_at: moment.utc().format("hh:mm a"),
      });
    }
  };
}

export default SocketEvents;
