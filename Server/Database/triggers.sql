create definer = root@localhost trigger channels_trigger
    after insert
    on channels
    for each row
BEGIN
    DECLARE NEW_ID_CHANNEL bigint;
    DECLARE NEW_ID_CHANNEL_MEMBER bigint;

    SET NEW_ID_CHANNEL = NEW.ID_CHANNEL;

    insert into channels_members(ID_USER, ID_CHANNEL, JOIN_DATE)
    values (NEW.ID_USER, NEW_ID_CHANNEL, current_timestamp());

    SET NEW_ID_CHANNEL_MEMBER = (SELECT ID_CHANNEL_MEMBER FROM CHANNELS_MEMBERS WHERE ID_CHANNEL = NEW_ID_CHANNEL);

    insert into channels_rooms(ID_CHANNEL, ID_CHANNEL_MEMBER, ROOM_NAME, TEXT_ROOM, AUTO_JOIN)
    values (NEW_ID_CHANNEL, NEW_ID_CHANNEL_MEMBER, 'Default', true, true);

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
                                         SEND_MESSAGES, CREATE_ROOMS)
        VALUES (NEW.ID_CHANNEL_MEMBER, TRUE, TRUE, TRUE, TRUE, TRUE);
    ELSE
        INSERT INTO CHANNELS_PERMISSIONS(ID_CHANNEL_MEMBER, DELETE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS,
                                         SEND_MESSAGES, CREATE_ROOMS)
        VALUES (NEW.ID_CHANNEL_MEMBER, FALSE, FALSE, FALSE, TRUE, FALSE);
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
        INSERT INTO channels_rooms_permissions (ID_CHANNEL_ROOM_MEMBER)
        VALUES (NEW.ID_CHANNEL_ROOM_MEMBER);
    END IF;

END;

create or replace definer = root@localhost trigger republichat.settings_trigger
    after insert
    on republichat.users
    for each row
    insert into settings(ID_USER) values (NEW.ID_USER);


create definer = root@localhost trigger CHANNELS_ROOMS_TRIGGER
    after insert
    on channels_rooms
    for each row
BEGIN

    IF (NEW.AUTO_JOIN = TRUE) THEN
        INSERT INTO channels_rooms_members(ID_CHANNEL_MEMBER, ID_CHANNEL_ROOM)
        SELECT ID_CHANNEL_MEMBER, NEW.ID_CHANNEL_ROOM
        FROM channels_members
        WHERE ID_CHANNEL = NEW.ID_CHANNEL;
    ELSE
        INSERT INTO channels_rooms_members(ID_CHANNEL_MEMBER, ID_CHANNEL_ROOM) VALUES (NEW.ID_CHANNEL_MEMBER, NEW.ID_CHANNEL_ROOM);
    end if;

END;

create or replace definer = root@localhost trigger republichat.channels_rooms_messages
    after insert
    on republichat.channels_rooms_messages
    for each row
BEGIN

    UPDATE channels_rooms_members
        SET UNREAD_MESSAGES = UNREAD_MESSAGES + 1
    WHERE ID_CHANNEL_ROOM = NEW.ID_CHANNEL_ROOM
      AND WATCHING = FALSE;

END;