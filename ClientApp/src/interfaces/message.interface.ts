export interface Message {
    id?: number;
    name: string;
    code?: string;
    message: string;
    color: string;
    picture: any;
    date: Date;
    auth: boolean;
}