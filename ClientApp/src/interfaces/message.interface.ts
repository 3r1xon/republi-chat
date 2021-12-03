export interface Message {
    id?: number;
    name: string;
    userName?: string;
    userMessage: string;
    userColor: string;
    userImage: any;
    date: Date;
    auth: boolean;
}