# File to generate my image

# user = monitor
# pass = monitor
# rootPass = monitor

FROM mysql:latest

MAINTAINER juan523

ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG MYSQL_ROOT_PASSWORD

ENV MYSQL_DATABASE=$MYSQL_DATABASE
ENV MYSQL_USER=$MYSQL_USER
ENV MYSQL_PASSWORD=$MYSQL_PASSWORD
ENV MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD

COPY ./initDB.sql /tmp

CMD [ "mysqld", "--init-file=/tmp/initDB.sql" ]

EXPOSE 3306

# spin container up with the following command: `docker build -t <container_tag(I used monitordb)> .`
# we will use compose to run containers and to do that we can access the containers either by pushing it to your docker 
# hub and then reference it from the docker hub registry directly in compose script or you could copy this docker file and
# add a "context" field with the path to this file to the compose file. I will push it to my hub profile
# To upload it to docker hub run this command: first, `docker build -t monitordb .`. Second,  `docker tag apache <usuarioDockerHub>/<tag>`
