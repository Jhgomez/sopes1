1. sudo apt-get update

2. sudo apt-get install ca-certificates curl

3. sudo install -m 0755 -d /etc/apt/keyrings

4. sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc

5. sudo chmod a+r /etc/apt/keyrings/docker.asc

6. echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

7. sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

8. Copy the compose script for the API components, you can either download it from git or just type it, whatever you want. I typed it. run `nano docker-compose.yml` and paste the script. and then `Ctrl + X` to save and close.

```yml
services:
  backend:
    image: juan523/monitorapi
    ports:
      - "8080:8080"
    environment:
      DB_HOST: ldb
      DB_NAME: monitor
      DB_USER: monitor
      DB_PASSWORD: monitor
      DB_PORT: 33060
    container_name: 'lnode'
    restart: always
    depends_on: 
      - data

  data:
    image: juan523/monitordb
    ports:
      - "33060:33060"
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: monitor
      MYSQL_DATABASE: monitor
      MYSQL_USER: monitor
      MYSQL_PASSWORD: monitor
    volumes:
      - mysql:/var/lib/mysql      
    container_name: 'ldb'
    restart: always

  grafana:
    image: grafana/grafana-enterprise
    container_name: grafana
    restart: unless-stopped
    # if you are running as root then set it to 0
    # else find the right id with the id -u command
    user: '0'
    environment:
      - GF_SERVER_ROOT_URL=http://my.grafana.server/
      - GF_INSTALL_PLUGINS=grafana-clock-panel
      - GF_SERVER_HTTP_PORT=3030
      - http_port=3030
      - GF_SECURITY_ADMIN_PASSWORD=monitor
      - GF_SECURITY_ADMIN_USER=monitor
    ports:
      - '3030:3030'
    # adding the mount volume point which we create earlier
    volumes:
      - grafana-storage:/var/lib/grafana
    depends_on:
      - backend
      
volumes:
  mysql:
  grafana-storage: {}

```

9. Login in to your docker account `docker login -u <username>` (this step can be omitted, the image should be public)

9. Run `sudo docker compose up`

10. Open a connection using the icon on top right, run `sudo docker exec -it ldb /bin/bash`, this will give you access to the db container enter `mysql -h localhost -u monitor -p` and enter password `monitor`. Now I'm connected to the db run `USE monitor;` to use the db and run the queries to monitor the tables content like `SELECT * FROM vm`, `SELECT * FROM ram`, `SELECT * FROM cpu`, `SELECT * FROM process`. You can access the default endpoint by entering in your browser `http://34.55.190.27:8080/`. Monitor the container with `sudo docker logs -f <container_name>`

11. Rember you can access the database by running this command from a CLI `docker exec -it <container_name> /bin/bash` in our case container is called `ldb`, now you are in the mysql server CLI. Run `mysql -h localhost -u monitor -p` and enter "monitor", our password. Now you can run queries, your first query should always be selecting the database `USE monitor;`  