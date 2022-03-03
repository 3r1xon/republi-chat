import { Room } from "./room.interface";

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
    deleteMessage: boolean;
}