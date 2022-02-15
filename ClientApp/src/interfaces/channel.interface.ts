import { Room } from "./room.interface";

export interface Channel {
    _id?: number;
    name: string;
    rooms?: Array<Room>
    code?: string;
    picture?: any;
}