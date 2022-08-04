# RepubliChat (BETA)
A free open source real-time chat with channels, rooms and permissions.
Currently hosted: https://republichat.mindrive.ddnsfree.com/

# How to start the project using Docker
Change the environment variable MARIADB_ROOT_PASSWORD inside the docker-compose.yml
along with the path of the certifications inside the server volumes key.
Be aware that the project uses Nginx and it will host Republichat on PORT 80 as HTTP,
use nginx-proxy-manager or something else to generate a valid SSL certificate and use HTTPS. 
An .env.prod file MUST be present inside the Server folder with the following keys:

NODE_ENV = production

SID_SIZE = 50

DB_HOST = /*Database IP*/

DB_USER = root

DB_PASSWORD = /*Database password*/

DATABASE = republichat

ORIGIN = https://republichat.mindrive.ddnsfree.com

PORT = 9696

CERT_KEY_PATH = ./Certifications/privkey.pem

CERT_PATH = ./Certifications/cert.pem

CLIENT_ID = /*Google email service client ID*/

CLIENT_SECRET = /*Google email service client secret*/

REDIRECT_URI = https://developers.google.com/oauthplayground

REFRESH_TOKEN = /*Google email service refresh token*/

environment.prod.ts client-side should be changed as well.
Then you can start the project using "docker-compose up -d".

# Screenshots
![Alt text](https://github.com/3r1xon/republi-chat/blob/master/Screenshots/login.png?raw=true)

![Alt text](https://github.com/3r1xon/republi-chat/blob/master/Screenshots/mainpage.png?raw=true)

![Alt text](https://github.com/3r1xon/republi-chat/blob/master/Screenshots/privacy.png?raw=true)

![Alt text](https://github.com/3r1xon/republi-chat/blob/master/Screenshots/settings.png?raw=true)
