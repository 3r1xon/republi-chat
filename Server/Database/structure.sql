create or replace table republichat.users
(
    ID_USER         bigint auto_increment
        primary key,
    USER_CODE       varchar(4)                    not null,
    EMAIL           varchar(30)                   not null,
    PASSWORD        varchar(255)                  not null,
    NAME            varchar(30)                   null,
    PROFILE_PICTURE mediumblob                    null,
    COLOR           varchar(30) default '#FFFFFF' null,
    BIOGRAPHY       varchar(200)                  null,
    constraint USERS_EMAIL_uindex
        unique (EMAIL)
);

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
);

create or replace table republichat.channels_members
(
    ID_CHANNEL_MEMBER bigint auto_increment
        primary key,
    ID_CHANNEL        bigint not null,
    ID_USER           bigint not null,
    STATUS            int    null,
    constraint CHANNELS_MEMBERS_CHANNELS_ID_CHANNEL_fk
        foreign key (ID_CHANNEL) references republichat.channels (ID_CHANNEL)
            on update cascade on delete cascade
);

create or replace table republichat.channels_messages
(
    ID_CHANNEL_MESSAGE bigint auto_increment
        primary key,
    ID_CHANNEL         bigint        not null,
    ID_CHANNEL_MEMBER  bigint        not null,
    MESSAGE            varchar(2000) null,
    DATE               datetime      null,
    constraint FK_CHANNELS_MESSAGES
        foreign key (ID_CHANNEL) references republichat.channels (ID_CHANNEL)
            on update cascade on delete cascade,
    constraint FK_USERS
        foreign key (ID_CHANNEL_MEMBER) references republichat.channels_members (ID_CHANNEL_MEMBER)
            on update cascade on delete cascade
);

create or replace table republichat.channels_permissions
(
    ID_CHANNEL_PERMISSION bigint auto_increment
        primary key,
    ID_CHANNEL_MEMBER     bigint               not null,
    DELETE_MESSAGE        tinyint(1) default 0 null,
    KICK_MEMBERS          tinyint(1) default 0 null,
    BAN_MEMBERS           tinyint(1) default 0 null,
    SEND_MESSAGES         tinyint(1) default 1 null,
    constraint FK_MEMBERS
        foreign key (ID_CHANNEL_MEMBER) references republichat.channels_members (ID_CHANNEL_MEMBER)
            on update cascade on delete cascade
);

create or replace table republichat.sessions
(
    ID_SESSION      bigint auto_increment
        primary key,
    ID_USER         bigint      not null,
    SESSION_ID      varchar(50) not null,
    BROWSER_NAME    varchar(30) null,
    BROWSER_VERSION varchar(30) null,
    LATITUDE        varchar(30) null,
    LONGITUDE       varchar(30) null,
    DATE            datetime    null,
    constraint sessions_SESSION_ID_uindex
        unique (SESSION_ID),
    constraint FK_USERS_1
        foreign key (ID_USER) references republichat.users (ID_USER)
            on update cascade on delete cascade
);