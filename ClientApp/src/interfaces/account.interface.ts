export interface Account {
  id: number;
  code: string;
  picture?: any;
  color?: string;
  backgroundColor?: string;
  userStatus?: UserStatus;
  biography?: string;
  name: string;
  email: string;
  lastJoinedChannel: number;
  lastJoinedRoom: number;
}



export enum UserStatus {
  offline = 0,
  online = 1
}
