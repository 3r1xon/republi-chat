-- MariaDB dump 10.19  Distrib 10.5.16-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: republichat
-- ------------------------------------------------------
-- Server version	10.5.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `channels`
--

DROP TABLE IF EXISTS `channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channels` (
  `ID_CHANNEL` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_USER` bigint(20) NOT NULL,
  `NAME` varchar(30) NOT NULL,
  `CHANNEL_CODE` varchar(4) NOT NULL,
  `PICTURE` mediumblob DEFAULT NULL,
  `CREATION_DATE` datetime DEFAULT NULL,
  `COLOR` varchar(7) DEFAULT '#ffffff',
  `BACKGROUND_COLOR` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`ID_CHANNEL`),
  KEY `CHANNELS_USERS_ID_USER_fk` (`ID_USER`),
  CONSTRAINT `CHANNELS_USERS_ID_USER_fk` FOREIGN KEY (`ID_USER`) REFERENCES `users` (`ID_USER`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger republichat.channels_trigger
    after insert
    on republichat.channels
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

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `channels_members`
--

DROP TABLE IF EXISTS `channels_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channels_members` (
  `ID_CHANNEL_MEMBER` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_CHANNEL` bigint(20) NOT NULL,
  `ID_USER` bigint(20) NOT NULL,
  `BANNED` tinyint(1) DEFAULT 0,
  `KICKED` tinyint(1) DEFAULT 0,
  `JOIN_DATE` datetime NOT NULL DEFAULT curdate(),
  `ORDER` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID_CHANNEL_MEMBER`),
  KEY `CHANNELS_MEMBERS_CHANNELS_ID_CHANNEL_fk` (`ID_CHANNEL`),
  CONSTRAINT `CHANNELS_MEMBERS_CHANNELS_ID_CHANNEL_fk` FOREIGN KEY (`ID_CHANNEL`) REFERENCES `channels` (`ID_CHANNEL`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger republichat.CHANNELS_MEMBERS_TRIGGER
    after insert
    on republichat.channels_members
    for each row
BEGIN
    IF NEW.ID_USER = (SELECT ID_USER
                      FROM CHANNELS CH
                      WHERE CH.ID_CHANNEL = NEW.ID_CHANNEL) THEN
        INSERT INTO CHANNELS_PERMISSIONS(ID_CHANNEL_MEMBER, DELETE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS,
                                         SEND_MESSAGES, CREATE_ROOMS, ACCEPT_MEMBERS, MANAGE_PERMISSIONS)
        VALUES (NEW.ID_CHANNEL_MEMBER, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);
    ELSE
        INSERT INTO CHANNELS_PERMISSIONS(ID_CHANNEL_MEMBER, DELETE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS,
                                         SEND_MESSAGES, CREATE_ROOMS)
        VALUES (NEW.ID_CHANNEL_MEMBER, FALSE, FALSE, FALSE, TRUE, FALSE);
    END IF;

    INSERT INTO CHANNELS_ROOMS_MEMBERS(ID_CHANNEL_ROOM, ID_CHANNEL_MEMBER)
    SELECT ID_CHANNEL_ROOM, NEW.ID_CHANNEL_MEMBER FROM CHANNELS_ROOMS WHERE AUTO_JOIN = TRUE AND ID_CHANNEL = NEW.ID_CHANNEL;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `channels_pendings`
--

DROP TABLE IF EXISTS `channels_pendings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channels_pendings` (
  `ID_CHANNEL_PENDING` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_CHANNEL` bigint(20) NOT NULL,
  `ID_USER` bigint(20) DEFAULT NULL,
  `ACCEPTED` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID_CHANNEL_PENDING`),
  KEY `channels_pendings_channels_ID_CHANNEL_fk` (`ID_CHANNEL`),
  KEY `channels_pendings_users_ID_USER_fk` (`ID_USER`),
  CONSTRAINT `channels_pendings_channels_ID_CHANNEL_fk` FOREIGN KEY (`ID_CHANNEL`) REFERENCES `channels` (`ID_CHANNEL`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `channels_pendings_users_ID_USER_fk` FOREIGN KEY (`ID_USER`) REFERENCES `users` (`ID_USER`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger republichat.CHANNELS_PENDINGS_TRIGGER
    after update
    on republichat.channels_pendings
    for each row
BEGIN

    IF NEW.ACCEPTED = 1 then
        INSERT INTO CHANNELS_MEMBERS
        (ID_USER, ID_CHANNEL)
        VALUES (NEW.ID_USER, NEW.ID_CHANNEL);

    end if;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `channels_permissions`
--

DROP TABLE IF EXISTS `channels_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channels_permissions` (
  `ID_CHANNEL_PERMISSION` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_CHANNEL_MEMBER` bigint(20) NOT NULL,
  `DELETE_MESSAGES` tinyint(1) DEFAULT 0,
  `KICK_MEMBERS` tinyint(1) DEFAULT 0,
  `BAN_MEMBERS` tinyint(1) DEFAULT 0,
  `SEND_MESSAGES` tinyint(1) DEFAULT 1,
  `CREATE_ROOMS` tinyint(1) DEFAULT 0,
  `ACCEPT_MEMBERS` tinyint(1) DEFAULT 0,
  `MANAGE_PERMISSIONS` tinyint(1) DEFAULT 0,
  `IMPORTANCE_LEVEL` bigint(20) DEFAULT 0,
  PRIMARY KEY (`ID_CHANNEL_PERMISSION`),
  KEY `FK_MEMBERS` (`ID_CHANNEL_MEMBER`),
  CONSTRAINT `FK_MEMBERS` FOREIGN KEY (`ID_CHANNEL_MEMBER`) REFERENCES `channels_members` (`ID_CHANNEL_MEMBER`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `channels_rooms`
--

DROP TABLE IF EXISTS `channels_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channels_rooms` (
  `ID_CHANNEL_ROOM` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_CHANNEL` bigint(20) NOT NULL,
  `ID_CHANNEL_MEMBER` bigint(20) NOT NULL,
  `ROOM_NAME` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TEXT_ROOM` tinyint(1) DEFAULT 1,
  `AUTO_JOIN` tinyint(1) DEFAULT 0,
  `ORDER` int(11) DEFAULT 0,
  PRIMARY KEY (`ID_CHANNEL_ROOM`),
  KEY `channels_rooms_channels_ID_CHANNEL_fk` (`ID_CHANNEL`),
  KEY `channels_rooms_channels_members_ID_CHANNEL_MEMBER_fk` (`ID_CHANNEL_MEMBER`),
  CONSTRAINT `channels_rooms_channels_ID_CHANNEL_fk` FOREIGN KEY (`ID_CHANNEL`) REFERENCES `channels` (`ID_CHANNEL`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `channels_rooms_channels_members_ID_CHANNEL_MEMBER_fk` FOREIGN KEY (`ID_CHANNEL_MEMBER`) REFERENCES `channels_members` (`ID_CHANNEL_MEMBER`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger republichat.CHANNELS_ROOMS_TRIGGER
    after insert
    on republichat.channels_rooms
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

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `channels_rooms_members`
--

DROP TABLE IF EXISTS `channels_rooms_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channels_rooms_members` (
  `ID_CHANNEL_ROOM_MEMBER` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_CHANNEL_MEMBER` bigint(20) DEFAULT NULL,
  `ID_CHANNEL_ROOM` bigint(20) NOT NULL,
  `JOIN_DATE` datetime DEFAULT current_timestamp(),
  `UNREAD_MESSAGES` int(11) DEFAULT 0,
  `WATCHING` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID_CHANNEL_ROOM_MEMBER`),
  KEY `CHANNELS_ROOMS_MEMBERS_CHANNELS_ROOMS_ID_CHANNEL_ROOM_FK` (`ID_CHANNEL_ROOM`),
  KEY `channels_rooms_members_channels_members_ID_CHANNEL_MEMBER_fk` (`ID_CHANNEL_MEMBER`),
  CONSTRAINT `CHANNELS_ROOMS_MEMBERS_CHANNELS_ROOMS_ID_CHANNEL_ROOM_FK` FOREIGN KEY (`ID_CHANNEL_ROOM`) REFERENCES `channels_rooms` (`ID_CHANNEL_ROOM`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `channels_rooms_members_channels_members_ID_CHANNEL_MEMBER_fk` FOREIGN KEY (`ID_CHANNEL_MEMBER`) REFERENCES `channels_members` (`ID_CHANNEL_MEMBER`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger republichat.CHANNELS_ROOMS_MEMBERS_TRIGGER
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

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `channels_rooms_messages`
--

DROP TABLE IF EXISTS `channels_rooms_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channels_rooms_messages` (
  `ID_CHANNEL_ROOM_MESSAGE` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_CHANNEL_ROOM` bigint(20) NOT NULL,
  `ID_CHANNEL_ROOM_MEMBER` bigint(20) NOT NULL,
  `MESSAGE` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DATE` datetime DEFAULT NULL,
  `HIGHLIGHTED` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ID_CHANNEL_ROOM_MESSAGE`),
  KEY `FK_USERS` (`ID_CHANNEL_ROOM_MEMBER`),
  KEY `channels_messages_channels_rooms_ID_CHANNEL_ROOM_fk` (`ID_CHANNEL_ROOM`),
  CONSTRAINT `FK_USERS` FOREIGN KEY (`ID_CHANNEL_ROOM_MEMBER`) REFERENCES `channels_rooms_members` (`ID_CHANNEL_ROOM_MEMBER`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `channels_messages_channels_rooms_ID_CHANNEL_ROOM_fk` FOREIGN KEY (`ID_CHANNEL_ROOM`) REFERENCES `channels_rooms` (`ID_CHANNEL_ROOM`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger republichat.channels_rooms_messages
    after insert
    on republichat.channels_rooms_messages
    for each row
BEGIN

    UPDATE channels_rooms_members
        SET UNREAD_MESSAGES = UNREAD_MESSAGES + 1
    WHERE ID_CHANNEL_ROOM = NEW.ID_CHANNEL_ROOM
      AND WATCHING = FALSE;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger republichat.channels_rooms_messages_delete
    after delete
    on republichat.channels_rooms_messages
    for each row
BEGIN

    UPDATE channels_rooms_members
    SET UNREAD_MESSAGES = UNREAD_MESSAGES - 1
    WHERE ID_CHANNEL_ROOM = OLD.ID_CHANNEL_ROOM
      AND WATCHING = FALSE
      AND UNREAD_MESSAGES > 0;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `channels_rooms_permissions`
--

DROP TABLE IF EXISTS `channels_rooms_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channels_rooms_permissions` (
  `ID_CHANNEL_ROOM_PERMISSION` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_CHANNEL_ROOM_MEMBER` bigint(20) DEFAULT NULL,
  `SEND_MESSAGES` tinyint(1) DEFAULT NULL,
  `DELETE_MESSAGES` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID_CHANNEL_ROOM_PERMISSION`),
  KEY `FK_CRP_TO_CRM` (`ID_CHANNEL_ROOM_MEMBER`),
  CONSTRAINT `FK_CRP_TO_CRM` FOREIGN KEY (`ID_CHANNEL_ROOM_MEMBER`) REFERENCES `channels_rooms_members` (`ID_CHANNEL_ROOM_MEMBER`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports` (
  `ID_REPORT` bigint(20) NOT NULL AUTO_INCREMENT,
  `TITLE` varchar(255) DEFAULT NULL,
  `CALLSTACK` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`ID_REPORT`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `ID_SESSION` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_USER` bigint(20) NOT NULL,
  `SID` varchar(50) NOT NULL,
  `SOCKET_ID` varchar(30) DEFAULT NULL,
  `BROWSER_NAME` varchar(30) DEFAULT NULL,
  `BROWSER_VERSION` varchar(30) DEFAULT NULL,
  `LATITUDE` varchar(30) DEFAULT NULL,
  `LONGITUDE` varchar(30) DEFAULT NULL,
  `DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_SESSION`),
  UNIQUE KEY `sessions_SESSION_ID_uindex` (`SID`),
  UNIQUE KEY `sessions_SOCKET_ID_uindex` (`SOCKET_ID`),
  KEY `FK_USERS_1` (`ID_USER`),
  CONSTRAINT `FK_USERS_1` FOREIGN KEY (`ID_USER`) REFERENCES `users` (`ID_USER`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `ID_SETTING` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_USER` bigint(20) NOT NULL,
  `SHOW_CHANNELS` tinyint(1) DEFAULT 1,
  `SHOW_SERVER_GROUP` tinyint(1) DEFAULT 1,
  `ANIMATIONS` tinyint(1) DEFAULT 1,
  `DATE_FORMAT` varchar(30) DEFAULT 'dd/MM/yyyy HH:mm:ss',
  PRIMARY KEY (`ID_SETTING`),
  UNIQUE KEY `settings_ID_USER_uindex` (`ID_USER`),
  CONSTRAINT `settings_users_ID_USER_fk` FOREIGN KEY (`ID_USER`) REFERENCES `users` (`ID_USER`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `ID_USER` bigint(20) NOT NULL AUTO_INCREMENT,
  `DELETED` tinyint(1) DEFAULT NULL,
  `USER_CODE` varchar(4) NOT NULL,
  `EMAIL` varchar(320) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `NAME` varchar(30) DEFAULT NULL,
  `PROFILE_PICTURE` mediumblob DEFAULT NULL,
  `COLOR` varchar(7) DEFAULT '#ffffff',
  `BACKGROUND_COLOR` varchar(7) DEFAULT NULL,
  `BIOGRAPHY` varchar(200) DEFAULT NULL,
  `USER_STATUS` int(11) DEFAULT NULL,
  `LAST_USER_STATUS` int(11) DEFAULT NULL,
  `VERIFIED` tinyint(1) DEFAULT 0,
  `LAST_JOINED_CHANNEL` bigint(20) DEFAULT NULL,
  `LAST_JOINED_ROOM` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID_USER`),
  UNIQUE KEY `USERS_EMAIL_uindex` (`EMAIL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger republichat.settings_trigger
    after insert
    on republichat.users
    for each row
    insert into settings(ID_USER) values (NEW.ID_USER) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users_verifications`
--

DROP TABLE IF EXISTS `users_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_verifications` (
  `ID_USER_VERIFICATION` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID_USER` bigint(20) NOT NULL,
  `VERIFICATION_CODE` varchar(30) NOT NULL,
  PRIMARY KEY (`ID_USER_VERIFICATION`),
  UNIQUE KEY `users_verifications_VERIFICATION_CODE_uindex` (`VERIFICATION_CODE`),
  KEY `users_verifications_users_ID_USER_fk` (`ID_USER`),
  CONSTRAINT `users_verifications_users_ID_USER_fk` FOREIGN KEY (`ID_USER`) REFERENCES `users` (`ID_USER`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-03 14:37:39
