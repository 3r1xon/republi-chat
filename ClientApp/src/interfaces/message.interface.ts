export interface Message {
    id?: number;
    name: string;
    author?: number;
    message: string;
    color: string;
    backgroundColor?: string;
    picture: any;
    date: Date;
    auth: boolean;
}