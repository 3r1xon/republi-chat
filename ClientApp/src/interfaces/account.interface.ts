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
  "Offline" = 0,
  "Online" = 1,
  "Do not disturb" = 2,
  "Sleeping" = 3
}
