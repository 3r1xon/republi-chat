export interface Message {
    id?: number;
    name: string;
    userCode?: string;
    userMessage: string;
    userColor: string;
    userImage: any;
    date: Date;
    auth: boolean;
}