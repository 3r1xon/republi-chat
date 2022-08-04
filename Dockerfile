FROM        node:14.15 AS node
WORKDIR     /republi-chat/docker-configs
COPY        ./docker-configs/* ./
WORKDIR     /republi-chat/ClientApp
COPY        ./ClientApp ./
RUN         npm i
RUN         npm i -g @angular/cli@12.2.0
RUN         ng build


FROM        nginx
COPY        --from=node /republi-chat/ClientApp/dist/RepubliChat/* /usr/share/nginx/html/
RUN         rm /etc/nginx/nginx.conf
COPY        --from=node /republi-chat/docker-configs/nginx.conf /etc/nginx/