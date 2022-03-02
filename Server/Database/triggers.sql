create or replace definer = root@localhost trigger republichat.channels_trigger
    after insert
    on republichat.channels
    for each row
BEGIN
    DECLARE NEW_ID_CHANNEL bigint;
    DECLARE NEW_ID_CHANNEL_MEMBER bigint;
    DECLARE NEW_ID_CHANNEL_ROOM bigint;

    SET NEW_ID_CHANNEL = NEW.ID_CHANNEL;

    insert into channels_members(ID_USER, ID_CHANNEL, JOIN_DATE)
    values (NEW.ID_USER, NEW_ID_CHANNEL, current_timestamp());

    SET NEW_ID_CHANNEL_MEMBER = (SELECT ID_CHANNEL_MEMBER FROM CHANNELS_MEMBERS WHERE ID_CHANNEL = NEW_ID_CHANNEL);

    insert into channels_rooms(ID_CHANNEL, ID_CHANNEL_MEMBER, ROOM_NAME, TEXT_ROOM, AUTO_JOIN)
    values (NEW_ID_CHANNEL, NEW_ID_CHANNEL_MEMBER, 'Default', true, true);

    SET NEW_ID_CHANNEL_ROOM = (SELECT ID_CHANNEL_ROOM FROM channels_rooms WHERE ID_CHANNEL = NEW_ID_CHANNEL);

    insert into channels_rooms_members(id_channel_member, id_channel_room)
    values (NEW_ID_CHANNEL_MEMBER, NEW_ID_CHANNEL_ROOM);
END;

create or replace definer = root@localhost trigger republichat.CHANNELS_MEMBERS_TRIGGER
    after insert
    on republichat.channels_members
    for each row
BEGIN
    IF NEW.ID_USER = (SELECT ID_USER
                      FROM CHANNELS CH
                      WHERE CH.ID_CHANNEL = NEW.ID_CHANNEL) THEN
        INSERT INTO CHANNELS_PERMISSIONS(ID_CHANNEL_MEMBER, DELETE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS,
                                         SEND_MESSAGES)
        VALUES (NEW.ID_CHANNEL_MEMBER, TRUE, TRUE, TRUE, TRUE);
    ELSE
        INSERT INTO CHANNELS_PERMISSIONS(ID_CHANNEL_MEMBER, DELETE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS,
                                         SEND_MESSAGES, CREATE_ROOMS)
        VALUES (NEW.ID_CHANNEL_MEMBER, FALSE, FALSE, FALSE, TRUE, TRUE);
    END IF;

    INSERT INTO CHANNELS_ROOMS_MEMBERS(ID_CHANNEL_ROOM, ID_CHANNEL_MEMBER)
    SELECT ID_CHANNEL_ROOM, NEW.ID_CHANNEL_MEMBER FROM CHANNELS_ROOMS WHERE AUTO_JOIN = TRUE AND ID_CHANNEL = NEW.ID_CHANNEL;

END;

create or replace definer = root@localhost trigger republichat.CHANNELS_ROOMS_MEMBERS_TRIGGER
    after insert
    on republichat.channels_rooms_members
    for each row
BEGIN

    IF NEW.ID_CHANNEL_MEMBER =
       (SELECT ID_CHANNEL_MEMBER FROM channels_rooms WHERE ID_CHANNEL_ROOM = NEW.ID_CHANNEL_ROOM) THEN

        INSERT INTO channels_rooms_permissions (ID_CHANNEL_ROOM_MEMBER, SEND_MESSAGES, DELETE_MESSAGES)
        VALUES (NEW.ID_CHANNEL_ROOM_MEMBER, true, true);
    ELSE
        INSERT INTO channels_rooms_permissions (ID_CHANNEL_ROOM_MEMBER, SEND_MESSAGES, DELETE_MESSAGES)
        VALUES (NEW.ID_CHANNEL_ROOM_MEMBER, true, false);
    END IF;

END;

create or replace definer = root@localhost trigger republichat.settings_trigger
    after insert
    on republichat.users
    for each row
    insert into settings(ID_USER) values (NEW.ID_USER);