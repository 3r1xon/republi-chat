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

    insert into channels_members(ID_USER, ID_CHANNEL, JOIN_DATE)
    values (NEW.ID_USER, NEW_ID_CHANNEL, current_timestamp());

    insert into channels_rooms(ID_CHANNEL, ROOM_NAME, TEXT_ROOM, AUTO_JOIN)
    values (NEW_ID_CHANNEL, 'Default', true, true);
END;


CREATE TRIGGER channels_members_trigger
    AFTER INSERT
    ON channels_members
    FOR EACH ROW
    IF NEW.ID_USER = (SELECT ID_USER
                      FROM channels ch
                      where ch.ID_CHANNEL = NEW.ID_CHANNEL) THEN
        insert into channels_permissions(ID_CHANNEL_MEMBER, DELETE_MESSAGE, KICK_MEMBERS, BAN_MEMBERS, SEND_MESSAGES)
        values (NEW.ID_CHANNEL_MEMBER, true, true, true, true);
    ELSE
        insert into channels_permissions(ID_CHANNEL_MEMBER, DELETE_MESSAGE, KICK_MEMBERS, BAN_MEMBERS, SEND_MESSAGES)
        values (NEW.ID_CHANNEL_MEMBER, false, false, false, true);
    END IF;



-- CREATE TRIGGER channels_members_trigger
--     AFTER INSERT
--     ON channels_members
--     FOR EACH ROW
-- BEGIN
--     DECLARE NEW_ID_CHANNEL_ROOM bigint;
--     DECLARE I bigint;
--     SET I = 1;

--     SELECT @ROWS = COUNT(0) FROM channels_rooms WHERE AUTO_JOIN = true AND ID_CHANNEL = NEW.ID_CHANNEL;

--     WHILE I <= @ROWS
--         DO
--             SET NEW_ID_CHANNEL_ROOM =
--                     (SELECT ID_CHANNEL_ROOM FROM channels_rooms WHERE AUTO_JOIN = true AND ID_CHANNEL = NEW.ID_CHANNEL);
--             insert into channels_rooms_members(ID_CHANNEL_ROOM)
--                 VALUE (NEW_ID_CHANNEL_ROOM);
--             SET I = I + 1;
--         END WHILE;

--     IF NEW.ID_USER = (SELECT ID_USER
--                       FROM channels ch
--                       where ch.ID_CHANNEL = NEW.ID_CHANNEL) THEN
--         insert into channels_permissions(ID_CHANNEL_MEMBER, DELETE_MESSAGE, KICK_MEMBERS, BAN_MEMBERS, SEND_MESSAGES)
--         values (NEW.ID_CHANNEL_MEMBER, true, true, true, true);
--     ELSE
--         insert into channels_permissions(ID_CHANNEL_MEMBER, DELETE_MESSAGE, KICK_MEMBERS, BAN_MEMBERS, SEND_MESSAGES)
--         values (NEW.ID_CHANNEL_MEMBER, false, false, false, true);
--     END IF;
-- END;