export interface Message {
  id?: number;
  name: string;
  author?: number;
  message: string;
  color: string;
  backgroundColor?: string;
  highlighted?: boolean;
  picture: any;
  date: Date;
  auth: boolean;
}
