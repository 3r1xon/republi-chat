import { Room } from "./room.interface";

export interface Channel {
    _id?: number;
    name: string;
    rooms?: {
        text: Array<Room>,
        vocal: Array<Room>
    },
    code?: string;
    picture?: any;
}