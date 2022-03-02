export interface ChannelPermissions {
    id: number;
    deleteMessage: boolean;
    kickMembers: boolean;
    banMembers: boolean;
    sendMessages: boolean;
}

export interface RoomPermissions {
    id: number;
    sendMessages: boolean;
    banMembers: boolean;
}