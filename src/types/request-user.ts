import type { User } from "./user";

export type ConnectionStatus =
  | "pending"
  | "interested"
  | "ignored"
  | "accepted"
  | "rejected"
  | "blocked";

export type SendConnectionStatus = "interested" | "ignored";
export type RespondConnectionAction = "accepted" | "rejected" | "blocked";

export interface Connection {
  _id: string;
  sender: User;
  receiver: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}
