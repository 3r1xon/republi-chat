export interface ChannelPermissions {
    id: number;
    deleteMessage: boolean;
    kickMembers: boolean;
    banMembers: boolean;
    sendMessages: boolean;
}