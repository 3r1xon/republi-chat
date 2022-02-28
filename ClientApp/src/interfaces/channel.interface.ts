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
}