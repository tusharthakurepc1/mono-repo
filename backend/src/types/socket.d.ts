import { Socket } from "socket.io"

export interface InhouseSocket extends Socket{
  inhouse_socket_id?: string;
}