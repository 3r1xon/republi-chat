CREATE TRIGGER settings_trigger
    AFTER INSERT
    ON users FOR EACH ROW
        insert into settings(ID_USER) values (NEW.ID_USER)


CREATE TRIGGER channels_trigger
    AFTER INSERT
    ON channels
    FOR EACH ROW
    insert into channels_members(ID_USER, ID_CHANNEL, JOIN_DATE)
    values (NEW.ID_USER, NEW.ID_CHANNEL, current_timestamp());


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
