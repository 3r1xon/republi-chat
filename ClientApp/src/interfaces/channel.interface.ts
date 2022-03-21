import { Account } from "./account.interface";

export interface Channel {
  id?: number;
  name: string;
  rooms?: {
    text: Array<Room>,
    vocal: Array<Room>
  },
  code?: string;
  picture?: any;
  color?: string;
  backgroundColor?: string;
}

export interface Room {
  roomID: number;
  roomName: string;
  textRoom: boolean;
  connected?: Array<Account>;
  members: Array<Account>;
  notifications?: number;
  draft?: string;
}

export interface ChannelPermissions {
  id: number;
  deleteMessage: boolean;
  kickMembers: boolean;
  banMembers: boolean;
  sendMessages: boolean;
}

export interface RoomPermissions {
  id: number;
  sendMessages: boolean;
  deleteMessages: boolean;
}
