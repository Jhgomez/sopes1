# Project

We will install an resource observer agent in VM created in GCP, this will monitor resource, and processes usage and this will be made with Golang, this program will execute some Kernel modules that will be installed which were built with C. These modules will give the agent written in golang all the system resources info, this info will be sent to some API services written with Node and expresso.js. Expresso is very famous, it works great for simple and small projects, it provides routing and middleware, but it lacks of some essential functions for web applications like authentication, authorization, validation, testing, logging, etc, which that are very important in larger applications but for this project it works very well. These services will receive objects with the resources info and will forward it to a database server, the ip address of this database will be entered in Grafana, and we will log in to the DB from here to then make queries to be able to see the info through a client accessing the IP address of the Grafana server. So a GCP VM instance will have three containers, one for Grafana, other for APIs written with node and the MySQL server. Then another container wich will be created through an "Instance Group" which will be configure to be elastic, each VM in this group will have a container with the monitoring agent installed, remember the the virtualization technique containers use is OS virtualization this means they don't have a kernel and they depend on the kernel of the host machine and that is why a container with the module we created can access the actual host resources and process info. Linux Kernel uses CGROUPS to manage the resources that will be assigned virtually to the container(RAM and Hard Drive Space)

# Build REST API, Database and Monitoring Agent
Our backend will have just two queries at the beginning, it will accept two posts methods. One post with a Json with RAM info and the other with a Json with CPU info

1. Create a project [following this instructions](https://dev.to/jaimaldullat/a-step-by-step-guide-to-creating-a-restful-api-using-nodejs-and-express-including-crud-operations-and-authentication-2mo2), you can also check the [official documentation](https://expressjs.com/en/starter/installing.html) there you can find pretty much the same instructions and a few tutorials later you will find the routing tutorials which we will need when we build the endpoints.

2. We need to create a script for our database, we have two options to get the SQL runtime environment to develop our script over, we can get it by installing SQL server locally in our computers or download a docker container, since we already have docker we will use a container with SQL server installed and use a DB client administration tool called DBeaver.

	* we need to separate processes, cpu and ram by a VM id for that we will use the VM IP address and we need to store the date to the able to also sort them by date

	* We need three objects, both will have an IP to identify the VM they belong to and a date to be sorted historically, the three objects are: CPU_usage, RAM_usage and process

3. Create an Docker-hub account

3. Download a container with SQL server installed

4. Create the data base schema

5. Create a Docker file, I used these examples, [one](https://dev.mysql.com/doc/refman/8.0/en/data-directory-initialization.html), [two](https://eloquentcode.com/create-a-mysql-docker-container-with-a-predefined-database) and [three](https://www.baeldung.com/ops/docker-mysql-container). In mostly used one and three as a guide, in the two option you can see how a database would be initialized. From this sources at least we can see two different ways to initialize a DB, either using Docker way with a "docker-entrypoint-initdb.d" or with sql's flag "--init-file=".

6.  We need to create an image that adds the layers we declared in our Dockerfile so we can then spin up containers with the configurations we specified. Run `docker build -t <repository_name>/<image:tag>:<version_tag> .`, the `repository_name` will help us push it to our docker hub account if we want to do so later but this field is optional, `version_tag` is optional. 

7. If we want to test the image we need to build a container from it. In section [Docker Environment Variables](https://dev.mysql.com/doc/refman/8.0/en/docker-mysql-more-topics.html) we can see that in MYSQL a default DB will be created if we pass a "MYSQL_DATABASE" variable, also if we set up the "MYSQL_USER" and "MYSQL_PASSWORD" it will be created and granted superuser permissions. Spin a container up with `docker run -it -d -p <host_port>:<constainer_port> -e MYSQL_DATABASE=<name> -e MYSQL_USER=<user> -e MYSQL_PASSWORD=<pass> -e MYSQL_ROOT_PASSWORD=<pass> --name=<container_name> <image_name>`. the image name will be looked into your docker repo first and if not exists it will check the public registry. MYSQL listens on port 3306 by default

8. The container is running now. You have different options connect to the DB server, first is from command line within the container, to do that make sure server is running with `docker ps` or `docker ps -a`, then from a command line run `docker exec -it <containter_name> /bin/bash` or use docker desktop to access de exec section, this will access the container CLI, then as indicated in [sql documentation](https://dev.mysql.com/doc/refman/8.4/en/connecting-disconnecting.html) run `MySQL -h <host(like localhost)> -u <user> -p` and enter the password if you didn't set up a user you should use the default "root" user. You're connected, you can execute queries here like `USE <db_name>` and select or insert, etc. Other options is to use an db administration tool like beaver to access it outside the container, basically enter the interface and enter same info, in beaver you might need enable flag `allowPublicKeyRetrieval` to true. At this point DB is configured

7. You need to set up the MYSQL client in the rest api now, we will use NPM's MYSQL package. You can check [their guide](https://github.com/mysqljs/mysql) however due to [this issue](https://github.com/mysqljs/mysql/issues/1507) we are going to use [node's mysql connector](https://github.com/mysql/mysql-connector-nodejs) and follow their [documentation](https://dev.mysql.com/doc/x-devapi-userguide/en/database-connection-example.html), be aware connector uses an authentication protocol named "x protocol" so we can not connect using port 3306 which is most commonly used but instead now we need to use protocol 33060

8. Now we need to containerize the REST api service, to do that I got my first insights [here](https://betterstack.com/community/guides/scaling-nodejs/dockerize-nodejs/) but actually went to the official documentation because I wanted to use Alpine variant of Node official Docker image, the script I found the script I used [here](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#smaller-images-without-npmyarn). Now we could build and image by running within the same directory as Docker with ``docker build -t <tag> .` and then create a container with `docker build -it -d --name=<name> -p 8080:8080 <imgage_tag>`.

9. Now we have two Docker containers, but in order to communicate them we have two options. First we could implement something called Docker network, for that we would modify our Dockerfiles but we will instead use Docker compose which helps us achieve this. If we would do either, we would have a hard time figuring out the ip address of the database so we can include it in "host" value in the database client connection in the REST API. After creating it run `docker compose up` from the directory from where you compose file is, if have modified the any of the servers code you can rebuild the containers declared in the compose file with `docker-compose up -d --force-recreate --build`

10. With the previous step we should be able test the REST API and the database if we build a simple http client that can make an post request to the correct port and correct JSON format, I created a file name "apipost.js" that can be launched with `npm i` and `node apipost.js`

11. Now I need to add the code for the agents, I added two directories each contains a C file and Makefile to generate a kernel module, to generate then you have to be on Linux, I used Ubuntu. for the directory of each module you have to run `make all`, if you get an error you may need to install linux headers `sudo apt-get install linux-headers-generic`. If you are running it from WSL you need to follow the instructions in [laboratory](../Lab/notes.md) "class 4' notes, you will have to compile a Kernel. When you build the modules you will get a ".ko" file for each module, install each using `sudo insmod <moduleName.ko>`, if you do this locally you can then check `dmesg` in the CLI to check the log also you can run them locally `cat /proc/<module_name>`

12. We need to containerize this agent also, so I created a docker file following [this example](https://github.com/docker-library/docs/tree/master/golang#how-to-use-this-image) from the official documentation. to create the image locally and run a container do `docker build -t goAgent .` and then `docker run -it -d --name=goAgent -p 3000:3000 goAgent`, remember again, the name ports and image name depends on what you have declared previously.

13. Now I added this to docker compose.

14. 

RAM json structure

[ways to get the client's IP address in node](https://www.abstractapi.com/guides/ip-geolocation/how-to-get-a-client-ip-address-in-node-js)

https://cloud.google.com/build/docs/build-config-file-schema