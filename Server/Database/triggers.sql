CREATE TRIGGER settings_trigger
    AFTER INSERT
    ON users FOR EACH ROW
        insert into settings(ID_USER) values (NEW.ID_USER)


CREATE TRIGGER channels_trigger
    AFTER INSERT
    ON channels
    FOR EACH ROW
BEGIN
    DECLARE NEW_ID_CHANNEL bigint;
    SET NEW_ID_CHANNEL = NEW.ID_CHANNEL;

    insert into channels_rooms(ID_CHANNEL, ROOM_NAME, TEXT_ROOM, AUTO_JOIN)
    values (NEW_ID_CHANNEL, 'Default', true, true);

    insert into channels_members(ID_USER, ID_CHANNEL, JOIN_DATE)
    values (NEW.ID_USER, NEW_ID_CHANNEL, current_timestamp());
END;

CREATE TRIGGER CHANNELS_MEMBERS_TRIGGER
    AFTER INSERT
    ON CHANNELS_MEMBERS
    FOR EACH ROW
BEGIN 
    IF NEW.ID_USER = (SELECT ID_USER
                      FROM CHANNELS CH
                      WHERE CH.ID_CHANNEL = NEW.ID_CHANNEL) THEN
        INSERT INTO CHANNELS_PERMISSIONS(ID_CHANNEL_MEMBER, DELETE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS,
                                         SEND_MESSAGES)
        VALUES (NEW.ID_CHANNEL_MEMBER, TRUE, TRUE, TRUE, TRUE);
    ELSE
        INSERT INTO CHANNELS_PERMISSIONS(ID_CHANNEL_MEMBER, DELETE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS,
                                         SEND_MESSAGES)
        VALUES (NEW.ID_CHANNEL_MEMBER, FALSE, FALSE, FALSE, TRUE);
    END IF;

    INSERT INTO CHANNELS_ROOMS_MEMBERS(ID_CHANNEL_ROOM)
    SELECT ID_CHANNEL_ROOM FROM CHANNELS_ROOMS WHERE AUTO_JOIN = TRUE AND ID_CHANNEL = NEW.ID_CHANNEL;

END;


-- CREATE TRIGGER channels_rooms_members_trigger
--     AFTER INSERT
--     ON channels_rooms_members
--     FOR EACH ROW

--     IF (SELECT ID_USER FROM users WHERE ) = ()

--     INSERT INTO channels_rooms_permissions (id_channel_room_member, send_messages, delete_messages)
--     VALUES (NEW.ID_CHANNEL_ROOM_MEMBER)