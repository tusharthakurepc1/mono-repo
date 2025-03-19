import { Schema } from "mongoose";
import { MONGO_INSTANCES } from "@database";
const dbConnection = MONGO_INSTANCES.praman;

export interface ISocketDetails {
  user_id: string;
  device_fingerprint_id: string; // Unique identifier for user device (device fingerprint)
  socket_id: string; // unique socket identifier
  // status: String, // online or offline
  // last_updated_at: Date, // last time this perticular socket online
}

const SocketSchema = new Schema<ISocketDetails>(
  {
    user_id: { type: String, unique: true, required: true },
    device_fingerprint_id: { type: String, required: true },
    socket_id: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const SocketModel = dbConnection.model("socketdetails", SocketSchema);
export default SocketModel;
