create or replace table republichat.users
(
    ID_USER          bigint auto_increment
        primary key,
    USER_CODE        varchar(4)                   not null,
    EMAIL            varchar(320)                 not null,
    PASSWORD         varchar(64)                  not null,
    NAME             varchar(30)                  null,
    PROFILE_PICTURE  mediumblob                   null,
    COLOR            varchar(7) default '#FFFFFF' null,
    BACKGROUND_COLOR varchar(7)                   null,
    BIOGRAPHY        varchar(200)                 null,
    constraint USERS_EMAIL_uindex
        unique (EMAIL)
)
    charset = utf8;

create or replace table republichat.channels
(
    ID_CHANNEL    bigint auto_increment
        primary key,
    ID_USER       bigint      not null,
    NAME          varchar(30) not null,
    CHANNEL_CODE  varchar(4)  not null,
    PICTURE       mediumblob  null,
    CREATION_DATE datetime    null,
    constraint CHANNELS_USERS_ID_USER_fk
        foreign key (ID_USER) references republichat.users (ID_USER)
            on update cascade on delete cascade
)
    charset = utf8;

create or replace table republichat.channels_members
(
    ID_CHANNEL_MEMBER bigint auto_increment
        primary key,
    ID_CHANNEL        bigint                       not null,
    ID_USER           bigint                       not null,
    BANNED            tinyint(1) default 0         null,
    KICKED            tinyint(1) default 0         null,
    JOIN_DATE         datetime   default curdate() not null,
    constraint CHANNELS_MEMBERS_CHANNELS_ID_CHANNEL_fk
        foreign key (ID_CHANNEL) references republichat.channels (ID_CHANNEL)
            on update cascade on delete cascade
)
    charset = utf8;

create or replace table republichat.channels_permissions
(
    ID_CHANNEL_PERMISSION bigint auto_increment
        primary key,
    ID_CHANNEL_MEMBER     bigint               not null,
    DELETE_MESSAGES       tinyint(1) default 0 null,
    KICK_MEMBERS          tinyint(1) default 0 null,
    BAN_MEMBERS           tinyint(1) default 0 null,
    SEND_MESSAGES         tinyint(1) default 1 null,
    constraint FK_MEMBERS
        foreign key (ID_CHANNEL_MEMBER) references republichat.channels_members (ID_CHANNEL_MEMBER)
            on update cascade on delete cascade
)
    charset = utf8;

create or replace table republichat.channels_rooms
(
    ID_CHANNEL_ROOM bigint auto_increment
        primary key,
    ID_CHANNEL      bigint                                 not null,
    ROOM_NAME       varchar(30) collate utf8mb4_unicode_ci null,
    TEXT_ROOM       tinyint(1) default 1                   null,
    AUTO_JOIN       tinyint(1) default 0                   null,
    constraint channels_rooms_channels_ID_CHANNEL_fk
        foreign key (ID_CHANNEL) references republichat.channels (ID_CHANNEL)
            on update cascade on delete cascade
)
    charset = utf8;

create or replace table republichat.channels_rooms_members
(
    ID_CHANNEL_ROOM_MEMBER bigint auto_increment
        primary key,
    ID_CHANNEL_MEMBER      bigint                     null,
    ID_CHANNEL_ROOM        bigint                     not null,
    JOIN_DATE              datetime default curdate() null,
    constraint CHANNELS_ROOMS_MEMBERS_CHANNELS_ROOMS_ID_CHANNEL_ROOM_FK
        foreign key (ID_CHANNEL_ROOM) references republichat.channels_rooms (ID_CHANNEL_ROOM)
            on update cascade on delete cascade,
    constraint channels_rooms_members_channels_members_ID_CHANNEL_MEMBER_fk
        foreign key (ID_CHANNEL_MEMBER) references republichat.channels_members (ID_CHANNEL_MEMBER)
            on update cascade on delete cascade
)
    charset = utf8;

create or replace table republichat.channels_rooms_messages
(
    ID_CHANNEL_ROOM_MESSAGE bigint auto_increment
        primary key,
    ID_CHANNEL_ROOM         bigint                                   not null,
    ID_CHANNEL_ROOM_MEMBER  bigint                                   not null,
    MESSAGE                 varchar(2000) collate utf8mb4_unicode_ci null,
    DATE                    datetime                                 null,
    constraint FK_USERS
        foreign key (ID_CHANNEL_ROOM_MEMBER) references republichat.channels_rooms_members (ID_CHANNEL_ROOM_MEMBER)
            on update cascade on delete cascade,
    constraint channels_messages_channels_rooms_ID_CHANNEL_ROOM_fk
        foreign key (ID_CHANNEL_ROOM) references republichat.channels_rooms (ID_CHANNEL_ROOM)
            on update cascade on delete cascade
)
    charset = utf8;

create or replace table republichat.channels_rooms_permissions
(
    ID_CHANNEL_ROOM_PERMISSION bigint auto_increment
        primary key,
    ID_CHANNEL_ROOM_MEMBER     bigint               null,
    SEND_MESSAGES              tinyint(1) default 1 null,
    DELETE_MESSAGES            tinyint(1) default 0 null,
    constraint FK_CRP_TO_CRM
        foreign key (ID_CHANNEL_ROOM_MEMBER) references republichat.channels_rooms_members (ID_CHANNEL_ROOM_MEMBER)
            on update cascade on delete cascade
)
    charset = utf8;

create or replace table republichat.sessions
(
    ID_SESSION      bigint auto_increment
        primary key,
    ID_USER         bigint      not null,
    SID             varchar(50) not null,
    SOCKET_ID       varchar(30) null,
    BROWSER_NAME    varchar(30) null,
    BROWSER_VERSION varchar(30) null,
    LATITUDE        varchar(30) null,
    LONGITUDE       varchar(30) null,
    DATE            datetime    null,
    constraint sessions_SESSION_ID_uindex
        unique (SID),
    constraint sessions_SOCKET_ID_uindex
        unique (SOCKET_ID),
    constraint FK_USERS_1
        foreign key (ID_USER) references republichat.users (ID_USER)
            on update cascade on delete cascade
)
    charset = utf8;

create or replace table republichat.settings
(
    ID_SETTING        bigint auto_increment
        primary key,
    ID_USER           bigint                                    not null,
    SHOW_CHANNELS     tinyint(1)  default 1                     null,
    SHOW_SERVER_GROUP tinyint(1)  default 1                     null,
    ANIMATIONS        tinyint(1)  default 1                     null,
    DATE_FORMAT       varchar(30) default 'dd/MM/yyyy HH:mm:ss' null,
    constraint settings_ID_USER_uindex
        unique (ID_USER),
    constraint settings_users_ID_USER_fk
        foreign key (ID_USER) references republichat.users (ID_USER)
            on update cascade on delete cascade
)
    charset = utf8;