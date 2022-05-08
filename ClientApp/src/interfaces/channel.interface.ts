import { Account } from "./account.interface";

export interface Channel {
  id?: number;
  name: string;
  rooms?: Array<Room>;
  pendings?: Array<Account>;
  members?: Array<Account>;
  code?: string;
  picture?: any;
  color?: string;
  backgroundColor?: string;
  founder?: number;
}

export interface Room {
  roomID: number;
  roomName: string;
  textRoom: boolean;
  connected?: Array<Account>;
  members: Array<Account>;
  notifications?: number;
  autoJoin: boolean;
  draft?: string;
}

export interface ChannelPermissions {
  id: number;
  deleteMessage: boolean;
  kickMembers: boolean;
  banMembers: boolean;
  sendMessages: boolean;
  createRooms: boolean;
  acceptMembers: boolean;
}

export interface RoomPermissions {
  id: number;
  sendMessages: boolean;
  deleteMessages: boolean;
}
