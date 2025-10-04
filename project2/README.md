# Description
In this project we are going to use Locust(python library) to send traffic to a Kubernetes Ingress controller(Nginx server) which uses a Kubernetes Ingress object to direct traffic to a service. The service then routes traffic to a gRCP client written 
in Golang that sends it to a gRCP server written in Golang as well, this server is a Kafka producer that sends messages to a Kafka broker/operator, another Kubernetes deployment will then have a kafka client written in Golang and will also be a Mongo client that send info to a Mongo database.The gRPC client will also make an http post to a REST API written in Rust which is also a redis client and sends the info to this Database and finally grafana connects to the database to display info.

Harbor and Grafana will be installed using Helm to be able to set up https traffic and authentication more easily and then, they will have their own ingress that also uses Nginx ingress controller, in total the ingress controller along with three ingress objects will route traffic to three different services, all other services will be exposing Kubernetes deployments internally only.

For more technologies by architecture components search for [cncf landscape](https://landscape.cncf.io/)

# Instructions

## Create Courses Sample Json

1. First we need to generate data in the following format using JSON, we will generate a 'pool' of fake entries using Python in `generator.py`

```json
{
  "curso": "SO1",
 "facultad": "ingenieria",
 “carrera: “sistemas”,
 "region”:”NORTE”
}
```

2. We need to start an python virtual environment to encapsulate our projects Python dependencies, so see [this](https://docs.python.org/3/library/venv.html#creating-virtual-environments) documentation to follow the steps. But basically if you're using after Python 3.5
we should use the `venv` application to create these environments.

3. Create the Python environment, run on CLI `python -m venv <path_to_store_environment>` I actually move to the directory I want to store it in and run `python -m venv venv`, this creates the directoy and the venv

4. Then as indicated [here](https://docs.python.org/3/library/venv.html#how-venvs-work) activate your venv, since I'm using git bash in Windows I just run in CLI `source venv/scripts/activate`, if you take a look this is a combination of the bash/zsh and cmd.exe/PowerShell commands

5. We wrote the courses generator file using "json", "random" and "io" libraries. After you create this Python file "gradesJsonGenerator.py" run it using `python gradesJsonGenerator.py`, you will get a json with sample grades

## Set up Locust
If you see the oras code there, you can comment it out and when we set up Harbor and Oras reinstate the code.

1. Install Locust following the [official documentation](https://docs.locust.io/en/stable/installation.html). Basically just do `pip install locust`

2. Write the Locust test in file named "locustfile.py", this code will be basically be doing, in our case, post requests to the Ingress controller. Follow the [official documentation](https://docs.locust.a/en/stable/quickstart.html) and for further customization [check here](https://docs.locust.io/en/stable/writing-a-locustfile.html#). 

3. Run the locust tasks in the locust file, in our case we are reading the generated json that contains the students grades. You have two options if you actually named your file "locustfile.py" just run command `locust` on the cli in the same directory as the file or if you name it differently or you are running in it from a different directoy run `locust -f <path_to_locust_file>`

3. Now you can check access the Locust server to see the requests that are being made using the [web interface](https://docs.locust.io/en/stable/quickstart.html#locust-s-web-interface) running in `http://localhost:8089`

## Set up Deployments

### Golang gRCP client and server along Rust Server/Redis client(First Deployment)
Basically both are server but the one in the middle is both, client and REST API server. The one that will receive requests from the ingress controller is both. It is an REST API server because it has an 'endpoint' that recieves the grade from Locust that is sending posts request to the it and is a client because it then forwards the information to the following container which is another gRCP server but this one is connected to the Mongo database. We will be using [gRPC's official documentation](https://grpc.io/docs/languages/go/basics/) to create a service in Golang

#### Create REST API-gRPC Client Server
We'll follow [official documentation](https://go.dev/doc/tutorial/web-service-gin) tutorial to create the REST API using Golang. We assume you've installed Golang

1. Create Golang module in the directory where your service code will live, run `go mod init grades/rest-service`

2. Create the Endpoint following the documentation, our REST API server is inside gRPC/client/grpcClient.go

3. Run `go get .` to add gin module as a dependency to our module.

3. Set environment variables
```bash
export GRPC_CLIENT_PORT=8000 \
export GRPC_CLIENT_HOST=localhost
```

4. Run the server with `go run .`

5. You can test it manually on your command line with `curl http://localhost:8000/` or the command below. You can also try it with Locust but make sure to change correct IP address, port and endpoint and then just run command `locust` with the venv activated and from the directoy of you locutsfile
```bash
curl http://localhost:8000/course \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"curso": "ANP", "facultad": "Ingenieria", "carrera": "Arte", "region": "METROPOLITANA"}'
```

6. Now I need to follow the gRPC official documentation in the description to create a gRPC client in this same server. As indicated there, we are going to generate the code using protocol buffers. To do that in Golang we need to install protocol buffers compiler and a Go plugin using [this guide](https://grpc.io/docs/languages/go/quickstart/#prerequisites). Download the proper architecture file from GitHub as indicated in the instructions, Create a directory wherever you want and copy the downloaded content, now add the "bin" folder to the `PATH` variable(in MacOs and Linux that is your .bash or .zsh file). 

7. Create a new environment variable, either a user or system variable, called "GOBIN" pointing to the directory you want the Golang plugins to be installed in and then add it to your "PATH" variable(I'm using windows, if you are on MacOs or Linux add it to your .bash or .zsh file). 

8. Protocol buffers are a way to define a service and the structures of info that a service will receive and return if any. Install plugins, run `go install google.golang.org/protobuf/cmd/protoc-gen-go@latest` and `go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest`. If you want to know more about how services and the data types, called "message"(you can think of the "message" keyword as the "class" keyword in Java), are generated look [here](https://protobuf.dev/programming-guides/proto3/). Each "rpc" inside a "sevice" in a ".proto" file is basically what an endpoint is in REST. Also see [here](https://protobuf.dev/reference/go/go-generated/#package) you need to define a `go_package` option in the ".proto" file. After all this is ready, from the directory where you created the ".proto" file, in our case is "gRPC/ProtoBuffer, just run:
```bash
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    ./courses.proto
```

9. Now we just follow the gRPC documentation to create the client. My implementation is in "gRPC/client/grpcClient.go"

10. We will add some logic to do an http post request to a Rust REST API later

#### Create gRPC Server
This node is an gRPC server that receives the notes and forwards them to a Kafka queue. First we are just going to implement gRPC server following the documentation previously mentioned. I created the implementation file in "gRPC/server/server.go"

If you want to test these servers, and clients run them from a different CLI each with `go run .` from the directory where each file lives and again you can run the curl command above. You also have to define two environment variables. If you are on bash or zshell you just run the following commands to create a temporary env variable
```bash
export GRPC_SERVER_PORT=8010 \
echo $GRPC_SERVER_PORT \
GRPC_SERVER_HOST=localhost \
echo $GRPC_SERVER_HOST
```
We will come back to add logic to be able to send the courses info a Kafka queue

#### Rust Server/Redis Client
This node will be receiving courses using a Rust REST API

1. Since I'm using Windows I went over [this](https://learn.microsoft.com/en-us/windows/dev-environment/rust/overview#the-pieces-of-the-rust-development-toolsetecosystem) documentation to get familiar with Rust terms and [this](https://learn.microsoft.com/en-us/windows/dev-environment/rust/setup) documentation to set up development environment for Rust, basically in windows you have to install C++ build tools, then you'll be able to install rust from their website. 

2. I'm going to use "actix web" framework to create a web server with a REST API following their [official documentation](https://actix.rs/docs/getting-started/) and to use [JSON](https://actix.rs/docs/extractors#json)

3. Create the environment variables using `export`
```bash
export RUST_SERVER_HOST=localhost \
export RUST_SERVER_PORT=8020 \
export REDIS_USERNAME=sopes \
export REDIS_PASSWORD=sopes
```

4. Run the server `cargo run`

5. You can test it with the command:
```bash
curl http://localhost:8020/course \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"curso": "ANP", "facultad": "Ingenieria", "carrera": "Arte", "region": "METROPOLITANA"}'
```

6. Now in the gRPC client on the previous section add http post request to this server

#### Set up Redis Client in Rust REST API server

1. Now we will set up the Redis client using [redis-rs](https://github.com/redis-rs/redis-rs) rust library. In the root directory of your server run, we added redis with asyn and json support to be able to create client connections asynchronously, and be able to send json to redis db `redis = { version = "0.27.6", features = ["async-std-comp", "json"] }`, also serde to be able to serialize and deserialize json `serde = { version = "1.0", features = ["derive"] }`, we need to deserialize when we receive the Json in post request and be able to serialize it when we send it to Redis db. Be aware we would have needed `serde_json` but `redis_rs` function to insert json actually does this for us, we just need to pass the json and it serializes it for us, but our json has to be serializable and we do this with `serde`. You also have to set environment variables to the Redis db with the following commands on CLI(redis default prot is 6379)
```bash
RUST_REDIS_PORT=6379
RUST_REDIS_HOST=<kubernetesObjectTag>
```

2. Since I'm using Windows and we will copy an native image to a rust docker container we need to compile it using WSL so I need to install rust from WSL with `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` and then install gcc, Rust needs its linker, `sudo apt-get install gcc`

3. Build an executable using `cargo build` will create a "debug" version or `cargo build --release` will build an optimized version of the executable. you can launch it using `cd target/release` and then just `./redis_client`. FYI there is also another command to compile it to an executable using `rustc main.rs` but this is a little more complicated to use, so is basically for a little more advanced users.

5. I can test it using Docker. I'm going to create a Redis database Docker container using the Bitmani's image, see [here](https://hub.docker.com/r/bitnami/redis) for info on how to set it up. Basically, assuming you have docker desktop installed and running, run bellow command(6379 is default port). optionally you can use the official [redis alpine version](https://github.com/docker-library/docs/tree/master/redis) with the image `redis:8.0-M02-alpine3.20`, the volume would be `-v /docker/host/dir:/data`
```bash
docker run --rm -d -it \
    --name=redis-server \
    -v redis-persistence:/data \
    -e REDIS_PASSWORD=course -e REDIS_MASTER_PASSWORD=course   \
    -p 6379:6379 \
    redis:8.0-M02-alpine3.20

docker ps # write down container id

docker exec -it <container_id> sh  # this start the alpines's command line

redis-cli  # access redis CLI to interact with Redis server
```

5. Search [here](https://redis.io/docs/latest/commands/) for JSON commands, remember we are storing JSON at very least we will use `JSON.GET `, get a list of key with `keys *` choose a key and now use the json query `JSON.GET <key> $`, this gets all the info in the key now we can choose fields in the json just by adding a point for and the a field in the json like `JSON.GET region $.CENTRAL`

6. Bellow is the logic using Redis commands to insert and read the info to and from Redis

```
// ---- Counters ---- //

INCR Regioncounter
INCR {facultad}counter
INCR {curso}counter

// ---- inserts ---- //

//////***** By Region *****////////
JSON.ARRAPPEND region $.{region} {object(object is turn to json by Redis API)}

//////***** By Facultad and Carrera *****////////
JSON.ARRAPPEND {facultad} $.{carrera} {object}

//////***** By Curso and Carrera *****////////
JSON.ARRAPPEND {Curso} $.{carrera} {object}

// ---- gets(get length of each array) ---- //

//////***** By Region *****////////
JSON.ARRLEN region $.{region} // try this per region
// or
JSON.ARRLEN region '$.[*]' // get length of all sections in this object

//////***** By Facultad and Carrera *****////////
JSON.ARRLEN {facultad} $.{carrera} // try this per facultad and carrera
// or
JSON.ARRLEN {facultad} '$.[*]' // get length of all sections in this object

//////***** By Curso and Carrera *****////////
JSON.ARRLEN {Curso} $.{carrera} // try this per facultad and carrera
// or
JSON.ARRLEN {Curso} '$.[*]' // get length of all sections in this object

// --- Initialization commands --- //
I will to check if the keys exist and if not initialize them in the function handling http requests as Json keys don't work same way as normal key for the project it is fine to do this when rust server is initialized, in a real life scenario we could do it with a init container maybe 

JSON.SET region $ '{"METROPOLITANA":[], "NORTE":[], "NORORIENTAL":[], "SURORIENTAL":[], "CENTRAL":[], "SUROCCIDENTAL":[], "NOROCCIDENTAL":[], "PETEN":[]}'

JSON.SET Ingenieria $ `{"Sistemas":[], "Industrial":[], "Quimica":[], "Civil":[]}` 

JSON.SET Medicina $ `{"General":[], "Pediatria":[], "Cirugia":[], "Oftalmologia":[]}` 

JSON.SET SO1 $ `{"Sistemas":[], "Industrial":[], "Quimica":[], "Civil":[]}` 

JSON.SET IA $ `{"Sistemas":[], "Industrial":[], "Quimica":[], "Civil":[]}` 

JSON.SET LAB $ `{"Sistemas":[], "Industrial":[], "Quimica":[], "Civil":[]}` 

JSON.SET SA $ `{"Sistemas":[], "Industrial":[], "Quimica":[], "Civil":[]}` 

JSON.SET OLC2 $ `{"Sistemas":[], "Industrial":[], "Quimica":[], "Civil":[]}` 

JSON.SET PA2 $ `{"General":[], "Pediatria":[], "Cirugia":[], "Oftalmologia":[]}` 

JSON.SET PED $ `{"General":[], "Pediatria":[], "Cirugia":[], "Oftalmologia":[]}` 
```


#### Set up Kafka Producer and Consumer
A very similar solution is called NATS, it may be more performant but Kafka is better handling high throughput. And in spring the solution for messaging is called "spring framework", another very popular solution is RabbitMQ

NATS, Kafka are message brokers. Kafka is actually a stream broker, message queues/brokers are also referred to as message queues. The difference between these two is that a queue only delivers last message to any consumer/subscriber while streaming brokers adds each message to something similar to a log and gives any new subscriber the whole log this makes possible to subscribers to "move" or access any point or info in the streaming, they can also change the point from where they want to start reading the stream. However this has changed and now NATS can do streaming 

RabbitMQ was born, like NATS, as message queue but is now also capable to do create streaming brokers. A message queue can be used, for example, in real life scenario to process orders in an e-commerce website while streaming brokers wouldn't fit this use case 

##### Producer
The gRCP server will be implementing a Kafka client using [sarama](https://github.com/IBM/sarama?tab=readme-ov-file) library, a library in Go for Apache Kafka. So all the code we will add is based on the examples and the [official documentation](https://pkg.go.dev/github.com/IBM/sarama) and [this](https://pkg.go.dev/github.com/IBM/sarama#section-readme). Basically we create a async producer and a topic on each post request received, we have to lock the execution(thread safe to handle async transactions) of this code one thread at a time to avoid kafka errors, we also have to give Kafka a few seconds to refresh and in our case for some reason, maybe because is a server or the specific golang gRPC server APIs, we were not able to commit transactions, instead to flush the transactions messages to Kafka I would have to run the Close() method, as you can see in the [documentation](https://pkg.go.dev/github.com/IBM/sarama#AsyncProducer) this method flushes the messages. Other important thing is to update a transactions id on the configuration of each new Kafka producer. We also sent the gRPC "message" in a Json format

##### Consumer(another deployment)
This is another deployment, this is not a server just a program with a Kafka consumer that at the same time will have a MongoDB client. It will push the info to MongoDB to be inserted as a Log when it receives it from Kafka, I used a "ConsumerGroup" but I could have used just a plain "Consumer"

```bash
docker run -d --name broker -p 9092:9092 apache/kafka:latest

docker ps # write down container id

docker exec -it <container_id> bin/sh  # this start the container's command line

cd /opt/kafka/bin/ # move to folder where Kafka is installed

./kafka-topics.sh --bootstrap-server localhost:9092 --create --topic <topic_name>  # create the topic in the broker

./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic <topic_name> --from-beginning  # start listening
```

Start your servers and send traffic to them using Locust in the Locust section

###### Add MongoDB client
The MongoDB Go driver needs instructions on where and how to connect to your MongoDB cluster. These instructions are stored in the connection string, which includes information on the hostname or IP address and port of your cluster, authentication mechanism, credentials where applicable, and other connection options. We can interact with the MongoDB shell in the MongoDB server with the command `mongosh`, see [here](https://www.mongodb.com/docs/manual/reference/method/) for a list of mongosh methods or just type `help` when you're inside the shell. For example I would first chose the db `use Course`, then `show collections` to show collections in this db, copy the name of collection you want to interact with, in this example I'll use the table called "Assignations", then `db.Assignations.find()` to display all the documents inside a collection. Mongo is a document-oriented database, as opposed to relational databases it stores the information in Json formats, this makes it incredibly flexible to the point it is either a pro or a con if not handled carefully. Here is a terms mapping from relational databases tp Mongo document-oriented data base. Clear database `db.dropDatabase()`

| Relational DB | MongoDB(Document-oriented DB) |
| ------------- | ----------------------------- |
| Database      |          Database             |
| Table         |          Collection           |
| Row           |          Document             |
| Column        |          Field                |

In our case we just need to start a MongoDB server, while developing you can do that using Docker but we will do this using Kubernetes when deploying the app. Once it is started we can just talk to it using the client, at this moment no Database exists yet other than the default one called "test" so in order to create one just start making queries, if you do a create query of a document to a db and collection that doesn't exist the db and collection will be created ant the document will be stored in it. Bellow is a list of official documentation that will be helpful to understand more about mongo

* [Quick start with go mongo driver](https://www.mongodb.com/docs/drivers/go/current/quick-start/)
* [Golang & Mongodb](https://www.mongodb.com/resources/languages/golang)
* [For GCP](https://www.mongodb.com/docs/atlas/)
* [Get started](https://www.mongodb.com/resources/languages/golang)
* [Docker get started](https://www.mongodb.com/resources/products/compatibilities/docker)
* [Documentation
running mongodb as a microservice with docker and Kubernetes # navigator search](https://github.com/mongodb/mongo-go-driver/blob/master/mongo/database.go#L48)
* [go mongo client library](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo)

##### Run Docker Mongo Container
* `docker run -it --name mongodb -d -p 27017:27017 mongodb/mongodb-community-server:7.0.6-ubi9 sh` or `docker run --name mongo -d -p 27017:27017 mongo:8.0.4`
* `docker exec -it mongodb sh` and then run * `mongosh` command

## Install gcloud CLI and Kubectl
I followed [this documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) to install kubectl. I used the [official documentation](https://cloud.google.com/sdk/docs/install) and [this guide](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl) to install "gcloud CLI", this is a [gcloud CLI cheat sheet](https://cloud.google.com/sdk/docs/cheatsheet).
	* `gcloud auth login`: login to your GCP account
	* `gcloud container clusters get-credentials sopes1 --zone us-central1-c --project sopes1-444607`: connect to the cluster we created
	* `kubectl create namespace project`: Create a namespace `kubectl create ns project --dry-run -o yaml`

## Setting up Harbor(Not good, it had to be installed in kubernetes)
I will follow the [official documentation](https://goharbor.io/docs/2.12.0/install-config/)


1. Create a VM instance, I used a static IP address when setting it up in the network options.


2. Access the CLI, you can do that from gcloud web cli I did it using the gcloud SDK installed in previous step. So from the "VM instances" section in "compute engine" I copy the command in "View gcloud command" and then just paste in in a local CLI and this will log me in to this VM instance


3. update the package tool `sudo apt-get update`


4. Install docker `sudo apt-get install docker.io` and Docker Compose `sudo apt-get install docker-compose`. If needed do a `apt-cache search <program>` to search an installer. Check they are installed just type `docker` on CLI and double tab key and you should see `docker`, `docker-compose` and more


5. From the doucumentation we will find the [releases](https://github.com/goharbor/harbor/releases) info in github and we will find the installers. right click the one you want and click on "copy link". I selected online installer "harbor-online-installer-v2.12.1.tgz". From the gcloud cli do a `wget https://github.com/goharbor/harbor/releases/download/v2.12.1/harbor-online-installer-v2.12.1.tgz`


6. Unzip the file with `tar -xzvf harbor-online-installer-v2.12.1.tgz`


7. `cd harbor`


8. Optionally we can check the Docker post install steps to avoid havint to use `sudo` with every docker command. Using [this guide](https://docs.docker.com/engine/install/linux-postinstall/). Do `sudo groupadd docker`, `sudo usermod -aG docker $USER`, then exit `exit` and log back in


9. Configure harbor´s yaml, `cd harbor` and copy it first `cp harbor.yml.tmpl harbor.yml`


10. Copy the IP address of the VM instance, append ".nip.io" to the end so we can have simulate a DNS. Mine will be `35.223.33.184.nip`

11. Configure the DNS in a cloud provider, I followed [this guide](https://cloud.google.com/dns/docs/set-up-dns-records-domain-name)

12. Get an standalone HTTPS certificate from a website like [letsencrypt](https://letsencrypt.org/getting-started/) which will tell you to go to [certbot](https://certbot.eff.org/) and here we would choose that our HTTP server is running on "other" and "Linux", when you reach this command `sudo certbot certonly --standalone` add the `-d <domain_name>` flag to it, this will list the domains you want the certificate generated for, mine is: Public: /etc/letsencrypt/live/35.223.33.184.nip.io/fullchain.pem Private: /etc/letsencrypt/live/35.223.33.184.nip.io/privkey.pem


13. Paste certificates and DNS address simulation into the yml file `nano harbor.yml`. When you're done do `ctrl + x` to save and exit. BTW you may want to change the admin and DB default password. I set it to "ensopes"


8. Run the installer script `sudo ./install.sh` 


9. Go to "https://35.223.33.184.nip.io/", you'll see Harbor's login screen. Log in using "admin" user and "ensopes" password


10. Create a new project and call it "sopes1", leave it private, don't make it public, nothing else and create it.


11. Create a user called "sopes1" with password "!\09IZbZ$3pC", I used Icloud email "bouquet.zoom.6h@icloud.com", firsta and last name "sopes uno"


12. Under the "sopes1" project go to the "members" tab and add a user with same name, "sopes1". Give it admin role


13. In the next step we will log in to our private registry through Docker but Docker client always attempts to connect via https, it looks like our previous set up is missing some TLS connections so we are just going to configure Docker client to allow connections to insecure registries via http protocols. So follow [this guide](https://goharbor.io/docs/1.10/install-config/run-installer-script/#connect-http). Basically add this `"insecure-registries" : ["35.223.33.184.nip.io", "35.223.33.184"]` to the config Json in `C:\Users\Juan Enrique\.docker\daemon.json` and in `windows-daemon.json`. More configurations can be found [here](https://docs.docker.com/reference/cli/dockerd/#/windows-configuration-file)


14. Now you have to login to your private registry. Log out from your docker account If you're logged in to your docker account `docker logout` and then `docker login <ip_address_or_DNS_if_you_configured_one> -u <ususario(sopes1)>` this is `docker login 35.223.33.184.nip.io -u sopes1` and enter password "!\09IZbZ$3pC"


15. Now in Harbor's "projects" view find "Repositories" tab and to the right a button with the name "PUSH COMMAND" find the ones you might need there. For example to tag an image for example an image I created called "juan503/kafka_client" we retag it with a different name with `docker tag juan503/kafka_client:latest 35.223.33.184.nip.io/sopes1/kafka_client:latest` and then push it `docker push `35.223.33.184.nip.io/sopes1/kafka_client:latest` then I can pull it up anywhere if I'm logged in to the registry with `docker pull 35.223.33.184.nip.io/sopes1/kafka_client:latest`

16. (Optional) if you even need to restart Harbor or reconfigure Docker on your computer. Follow [this guide](https://goharbor.io/docs/1.10/install-config/run-installer-script/#connect-http) to restart both and remember to do the `daemon.json` docker configurations


## Containerizing applications(Dockerizing Applications)

Here is a very interesting [document](https://www.michalklempa.com/2023/03/combining-docker-images/) explaining what multi-layer docker images are and how we can inspect images further. `docker history --no-trunc=true <image_name> > <file_name>`, this gets the docker command history written into the file name given. `docker run --entrypoint '' --rm -it <image_name> /bin/sh`: This could helps us debug an image, basically we pass an empty entry point and then we execute the shell with the last command `/bin/sh` it could be /bin/bash`, after this we could try things like get the file address of a binary like `which curl` or `which java`, etc. To build all images I went to through their official repo

You have to check Hub.Docker to get the image you want and then usually go to their github repo and see how you an build a Docker file once the Dockerfile is generated just build the image with `docker build Dockerfile .`. Be aware I had to build my gRPC client image with the following code `docker build -f client/Dockerfile -t grpc_client .`

### List of containers ports
This is a list of the ports that our images are exposing. 

1. gRPC client: 8000
2. gRPC server:
3


## Setting up Kubernetes

### Create a self-signed TLS certificate(Optional)
This step is optional because you make your private registry be signed by a know certificate authority you can se how below. We will use this to be able to communicate to our Harbor ingress controller using https(http over tls), we will give the generated private key and public key/certificate to a Kubernetes secret which is then passed to Harbor configuration values file which when installed using this file will create an ingress controller(of nginx type in our case) that uses this TLS certificate to enable https communication, we will need to install the certificate in our local computer and will use these certificates when setting up harbor as well.

1. Follow the ["Using Elliptic Curve Key Algorithm"](#using-elliptic-curve-key-algorithm) section to learn how to create a self-signed TLS certificate. Interesting fact is I'm using elliptic curve algorithms instead of RSA.

### Creating A GCP Secret(optional if you choose to use a known CA)
If you're planning to accessing a private registry that is behind a server(will use nginx ingress controller) that authenticates tls connections using a public key certificate signed by a private certificate authority(CA) follow this section. So we will follow [this guide](https://cloud.google.com/kubernetes-engine/docs/how-to/access-private-registries-private-certificates) so from a cli running on the directory containing your certificates run `gcloud secrets create ca-cert --replication-policy="automatic" --data-file=ca-cert.pem`

### Creating an Custom Service Account
In the "IAM & Admin" section go to "Service Accounts", and as indicated in the [documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/access-private-registries-private-certificates#configure-secret-manager-access-gke) add roles "", "" and "".

As a best practice check how to configure he [least-privileged service accounts](https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#use_least_privilege_sa)

I choosed to use a custom service account because when you use one by default your cluster and node pool gets the "cloud-platform" access scope assigned, other wise we would have to specify them manually meaning we would have to create the cluster using a glcoud command, you can see that is how it works [here](https://cloud.google.com/kubernetes-engine/docs/how-to/access-scopes#default_access_scopes), and if you want to know how to assign them with a command see [here](https://cloud.google.com/sdk/gcloud/reference/container/clusters/create#--scopes)

### Creating a GCP Cluster(GKE)
If you choose to use a known CA to sign your connections to your private registry the instructions to create a GKE cluster in this section doesn't apply and you'd just create a cluster without those specific configurations. Be aware I used the default service account to get permissions and roles so by default I the [compute engine default service account](https://cloud.google.com/compute/docs/access/service-accounts#default_service_account) is used.

We follow [this guide requirementes](https://cloud.google.com/kubernetes-engine/docs/how-to/access-private-registries-private-certificates), basically they are pretty much the default values when you create a cluster with the "Standard: You manage your cluster" flow, but the important configurations when creating it from the cloud UI are in "default-pool/Security", select custom service account but in my case since I'm using the default service account, since that is the account selected out of the box which is already created by GCP automatically, I just need to enable "Allow full access to all Cloud APIs" and then in the "security" section enable "Enable Secret Manager" and "Enable Workload Identity", this is all because we are going to access a private registry with certificate signed by a private certificate authority

### Check Scopes

1. Ge the project number, you can get it from the project's console
``` 
gcloud projects describe sopes1-444607 \
    --format="value(projectNumber)"
```

2. Check cluster's access scopes. If your cluster doesn't have the https://www.googleapis.com/auth/cloud-platform access scope, create a new cluster with this access scope.
```
gcloud container clusters describe regix \
  --location=us-south1-a \
  --flatten=nodeConfig \
  --format='csv[delimiter="\\n",no-heading](oauthScopes)'
```

3. Check standard cluster/node pool access scopes. If your cluster doesn't have the `https://www.googleapis.com/auth/cloud-platform` access scope, create a new cluster with this access scope. 
```
gcloud container node-pools describe default-pool \
  --cluster=regix \
  --location=us-south1-a \
  --flatten=config \
  --format='csv[delimiter="\\n",no-heading](oauthScopes)'
```

4. (optional) Using [this](https://cloud.google.com/sdk/gcloud/reference/container/node-pools/create) and [this guide]() created the following command to create a node-pool with n2 computer to explictly choose the scopes
```
gcloud container node-pools create my-pools \
  --num-nodes=2 \
  --cluster=regix \
  --disk-size=50 \
  --disk-type=pd-balanced \
  --image-type=COS_CONTAINERD \
  --machine-type=n2-standard-2 \
  --node-version=1.30.8-gke.1051000 \
  --service-account=juangke@sopes1-444607.iam.gserviceaccount.com \
  --enable-surge-upgrade \
  --max-surge-upgrade=1 \
  --max-unavailable-upgrade=0 \
  --workload-metadata=GKE_METADATA \
  --scopes=cloud-platform,logging-write,monitoring,service-management,service-control,trace \
  --node-locations=us-south1-a \
  --zone=us-south1-a
```

### Configure Containerd in Existing clusters(optional if using a known CA)
According to [official documentation](https://kubernetes.io/docs/setup/production-environment/container-runtimes/) all nodes in the cluster will install a CRI(container runtime interface), in this case most of the times it is containerd which is a container runtime, its configurations are used to determine whether an https/http connection is safe, without doing this configuration "kubelet"(component in charge to pull docker images in k8) will fail with an error like "tls: failed to verify certificate: x509: certificate signed by unknown authority", so we will pass/install the certificate to all nodes in the cluster by configuring containerd in this section. 

Following same guide previously mentioned in other sections but [this](https://cloud.google.com/kubernetes-engine/docs/how-to/access-private-registries-private-certificates#create-config-file) specific section:

1. Create a "containerd-configuration.yaml" with following configs:
```yaml
privateRegistryAccessConfig:
  certificateAuthorityDomainConfig:
  - gcpSecretManagerCertificateConfig:
      secretURI: "projects/438194862050/secrets/ca-cert/versions/1"
    fqdns:
      - "core.harbor.sopes"
  enabled: true
```

2, Update cluster to use configurations, make sure to run it from a terminal 
```
gcloud container clusters update regix \
    --location=us-south1-a \
    --containerd-config-from-file=containerd-configuration.yaml
```

3. My cluster uses automatic upgrades but if your cluster/node-pool doesn't do automatic upgrades run:
```
gcloud container clusters upgrade CLUSTER_NAME \
    --location=LOCATION \
    --cluster-version=VERSION
```

4. Check containerd's configuration, you should see your configurations with this command:
```
gcloud container clusters describe regix \
    --location=us-south1-a \
    --flatten="nodePoolDefaults.nodeConfigDefaults.containerdConfig"
```

### Special Section, "what do these configs actually do?"
From [here](https://cloud.google.com/kubernetes-engine/docs/how-to/access-private-registries-private-certificates) I found the following info [here](https://github.com/containerd/containerd/blob/main/docs/hosts.md#hoststoml-content-description---detail)

The following was found in ContainerD's offical github repo:

```
Bypass TLS Verification Example in Containerd
To bypass the TLS verification for a private registry at 192.168.31.250:5000

Create a path and hosts.toml text at the path "/etc/containerd/certs.d/docker.io/hosts.toml" with following or similar contents:

server = "https://registry-1.docker.io"

[host."http://192.168.31.250:5000"]
  capabilities = ["pull", "resolve", "push"]
  skip_verify = true


CRI
The old CRI config pattern for specifying registry.mirrors and registry.configs has been DEPRECATED. You should now point your registry config_path to the path where your hosts.toml files are located.

Modify your config.toml (default location: /etc/containerd/config.toml) as follows:

In containerd 2.x
version = 3

[plugins."io.containerd.cri.v1.images".registry]
   config_path = "/etc/containerd/certs.d"


In containerd 1.x
version = 2

[plugins."io.containerd.grpc.v1.cri".registry]
   config_path = "/etc/containerd/certs.d"

However they are now moved to a file called /etc/containerd/certs.d as mentioned [here](https://github.com/containerd/containerd/issues/9199)
```

We could have done this manually somehow but it is better to do it using google configs

Another option we had was to use a Kubernetes object called "daemonset", it would have allowed us to somehow install the CA or somehow modify the containerd version install on each node to allow insecure connections I found this script that does exactly that [here](https://cloud.google.com/kubernetes-engine/docs/how-to/access-private-registries-private-certificates#update-ds-both-models) and [here](https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-node-tools/master/container-insecure-registry/insecure-registry-config.yaml)

```
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: insecure-registries
  namespace: default
  labels:
    k8s-app: insecure-registries
spec:
  selector:
    matchLabels:
      name: insecure-registries
  updateStrategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        name: insecure-registries
    spec:
      nodeSelector:
        cloud.google.com/gke-container-runtime: "containerd"
      hostPID: true
      containers:
        - name: startup-script
          image: registry.k8s.io/startup-script:v2
          imagePullPolicy: Always
          securityContext:
            privileged: true
          env:
          - name: ADDRESS
            value: "REGISTRY_ADDRESS"
          - name: STARTUP_SCRIPT
            value: |
              set -o errexit
              set -o pipefail
              set -o nounset

              if [[ -z "$ADDRESS" || "$ADDRESS" == "REGISTRY_ADDRESS" ]]; then
                echo "Error: Environment variable ADDRESS is not set in containers.spec.env"
                exit 1
              fi

              echo "Allowlisting insecure registries..."
              containerd_config="/etc/containerd/config.toml"
              hostpath=$(sed -nr 's;  config_path = "([-/a-z0-9_.]+)";\1;p' "$containerd_config")
              if [[ -z "$hostpath" ]]; then
                echo "Node uses CRI config model V1 (deprecated), adding mirror under $containerd_config..."
                grep -qxF '[plugins."io.containerd.grpc.v1.cri".registry.mirrors."'$ADDRESS'"]' "$containerd_config" || \
                  echo -e '[plugins."io.containerd.grpc.v1.cri".registry.mirrors."'$ADDRESS'"]\n  endpoint = ["http://'$ADDRESS'"]' >> "$containerd_config"
              else
                host_config_dir="$hostpath/$ADDRESS"
                host_config_file="$host_config_dir/hosts.toml"
                echo "Node uses CRI config model V2, adding mirror under $host_config_file..."
                if [[ ! -e "$host_config_file" ]]; then
                  mkdir -p "$host_config_dir"
                  echo -e "server = \"https://$ADDRESS\"\n" > "$host_config_file"
                fi
                echo -e "[host.\"http://$ADDRESS\"]\n  capabilities = [\"pull\", \"resolve\"]\n" >> "$host_config_file"
              fi
              echo "Reloading systemd management configuration"
              systemctl daemon-reload
              echo "Restarting containerd..."
              systemctl restart containerd
```

### Install cert-manager(optional)(pending)
To avoid creating a private certificate authority and sign tls public key certificates using that CA and configure containerd you can install [cer-manager](cert-manager.io)


### Install Helm
Install it using the [official documentation](https://helm.sh/docs/intro/quickstart/). Helm help us install packages to Kubernetes clusters, we'll use it in next section.

#### Set up a Nginx Controller using Helm
Following [this documentation](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) will direct you [here](https://kubernetes.github.io/ingress-nginx/deploy/). We will use this controller to be able to expose the cluster with a DNS address and direct traffic to a Kubernetes object called Ingress, the controller is a load balancer. It only allows http and https traffic through port 80 and 443. We are basically following the sintax in [this section](https://kubernetes.github.io/ingress-nginx/deploy/#ovhcloud)

* (Ignore) `kubectl apply -f https://raw.githubusercontent.com/nginxinc/kubernetes-ingress/v4.0.0/deploy/crds.yaml`: Installs CRDs

* (Ignore) `kubectl delete -f crds/`: If you need to uninstall CRDs

1. `helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`: adds a repo to helm, it is similar to adding a source in Ubuntu's advanced package tool(apt), which is the Ubuntu's package manager

2. `helm repo update`

3. `helm install nginx-ingress ingress-nginx/ingress-nginx -n project`: Installs controller, basically this command means the following `helm install <give_installation_a_name> <repo_name>/<file_in_repo_name> -n <name_space_in_which_to_install_it>`. When installation ends you'll get an exammple copy that and paste it in a YAML file

4. `kubectl get ingressclass`: shows ingress controller info

5. Get the ingress contorller's External-IP/public IP with command `kubectl get svc -n project` and append `.nip.io` to the end if you want to know how this works check [their website](https://nip.io/), this will simulate a DNS for our IP address. My external-ip address is `34.174.102.23`, copy it and see next step

6. Creater script with `kubectl create ingress project-ingress -n project --class=nginx --rule="34.174.102.23.nip.io/*=s-api-rest-grpc:80" --dry-run=client -o yaml > ingress.yaml`

7. Modify yaml file and add nginx configurations by adding an `annotations` section under `metadata`, I used [this](https://docs.nginx.com/nginx-ingress-controller/installation/ingress-nginx/#header-manipulation) and [this documentation](https://docs.nginx.com/nginx-ingress-controller/installation/ingress-nginx/#header-manipulation) to get these configurations. also make sure to add the namespace
```
  annotations:
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/cors-allow-headers: "X-Forwarded-For"
    nginx.ingress.kubernetes.io/cors-allow-methods: "PUT, GET, POST, OPTIONS"
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
``` 

8. Create ingress `kubectl create -f ingress.yaml`

### Setting up Harbor(In Kubernetes cluster)
Follow [this guide](https://goharbor.io/docs/edge/install-config/harbor-ha-helm/) 

1. `helm repo add harbor https://helm.goharbor.io`

2. `helm fetch harbor/harbor --untar`, this generates a Harbor directory with the "values.yml" file

2. `kubectl create secret tls harbor-tls -n project --key server-key.pem --cert server-cert.pem -o yaml --dry-run=client > harbor-tls-secret.yaml`, this will store the public key certificate and private key in a tls Kubernetes secret. They keys will be base64 encoded, so if you want to see how they look originally you can decode them. Be aware private keys can not be encrypted otherwise the Kubernetes secret won't be able to base64 encode and then decode it, meaning Kubernetes seems to not have support for encrypted private keys. We also need to copy the content of the certificate authority certificate we created called "ca-cert.pem"(it uld be .crt) go to a base64 encoder, encode it and paste it in the yaml file under the name of `ca.crt`. Create the secret in your cluster with `kubectl create -f harbor-tls-secret.yaml`.

3. Install the certificate/public key we generated as an certified authority "ca-cert.pem"(it could be .crt) on your computer. In windows you can follow [this tutorial](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/trusted-root-certification-authorities-certificate-store), basically use "mmc" app and select if you want to install it in your user only or in the whole system and then go to the "Trusted Root Certification Authorities" section to install it in there or remove it if you want however an easier option would be to make sure the certificate has an extension of ".crt" and then just double click it, again make the selections to install it in the "correct place". For Linux and MacOs you'll have to investigate a little

3. Edit "values.yml" you need to configure this `expose.ingress.hosts.core` and this `externalURL` to a domain name you want, we will use that domain name later, mine is `core.harbor.sopes` . Also set `tls.enable` to true and `tls.certSource` to "secret", note default is "auto". In `ingress.className` enter "nginx". In `persistance.persistentVolumeClaim.registry.storageClass`, `persistence.persistentVolumeClaim.jobservice.storageClass`, `persistence.persistentVolumeClaim.database.storageClass`, `persistence.persistentVolumeClaim.redis.storageClass`, `persistence.persistentVolumeClaim.trivy.storageClass` enter `standard-rwo` this will helps us persist harbors info using gke's default storage called `standard-rwo`. You'll access with `https://core.harbor.sopes` later. Add the secret name we created before "harbor-tls" to `tls.secret.secretName` and also to `caSecretName`

4. From directory containing the generated harbor file do `helm install harbor harbor -n project` or 'helm install harbor harbor/harbor -n project', check harbor is installed by checking it pods `kubectl get pods -n project`, `kubectl get services -n project`, `kubectl get pvc -n project`. To uninstall it do `helm uninstall harbor harbor -n project` and to completely uninstall make sure to delete private storage claims(pvc) as well

5. Harbor creates a lots of resources like some private volume claims and also in our case an ingress, give it a few minutes and then get the "harbor-ingress" external IP address which should be the same as any other ingress using the Nginx ingress controller class we created but with a different host name so copy it by getting it with `kubectl get ingress -n project`

6. Using the IP address from previous step create a local DNS, I'm windows, but is very similar in Unix systems. My external IP is `34.57.250.18`, Open `hosts` file that lives in this address `C:\Windows\System32\drivers\etc` and paste `34.174.102.23 core.harbor.sopes`, you should open a notepad running as an administrator to edit this file

### Create Harbor Project

1. Login with default user `admin` with default password `Harbor12345` you could have also change that in the `values.yml` file in previous sections. Change password to `952-WOp0m$7t`

2, Create a user with name `sopes1`, email `bouquet.zoom.6h@icloud.com`, fist/last name `sopes uno`, password `952-WOp0m$7t`

3. Create project called `sopes1`, leave it private, and in the members tab inside the project add the user we just created `sopes1` as administrator

### Tag images and push to Harbor

1. Do `docker logout` if you're logged in to your docker account and then loging to docker `docker login core.harbor.sopes -u sopes1` with password `952-WOp0m$7t`

2. Now in Harbor's "projects" view find "Repositories" tab and to the right a button with the name "PUSH COMMAND" find the ones you might need there. For example to tag an image for example an image I created called "juan503/kafka_client" we retag it with a different name with `docker tag juan523/kafkaclient:latest core.harbor.sopes/sopes1/kafkaclient:latest` and then push it `docker push core.harbor.sopes/sopes1/kafkaclient:latest` then I can pull it up anywhere if I'm logged in to the registry with `docker pull 35.223.33.184.nip.io/sopes1/kafka_client:latest`

### Configuring host DNS
At this point when pulling and image without any further set up, first kubelet will display error "could not resolve/find host core.harbor.sopes", this is because I actually didn't buy any domain so I need to simulate a DNS and this is possible by connecting to the vm instance that the cluster is running over. So connect via ssh any way you want, either from gcp shell or using gcloud once you're in the shell do `sudo nano /etc/hosts` and add the ip address of the service that Harbor created, you could get it from `kubectl get ingress -n project` or `kubectl get svc -n project` and then paste it like `34.174.102.23 core.harbor.sopes`, this will avoid kubelet failing due to not finding the domain.

### Pulling Images From Harbor In Kubernetes
[This guide](https://goharbor.io/docs/2.12.0/working-with-projects/working-with-images/pulling-pushing-images/#pulling-images-from-harbor-in-kubernetes) shows how you will pull docker images in your Kubernetes objects, also check this Kubernetes official documentation describing [how to pull images from a private registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)

3. Create a secret with the key and password of the user we created before as shown [here](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/). You can decode base 64 encoded string generated in the secret to make sure the info is correct
```bash
kubectl create secret docker-registry harbor-cred -n project --docker-server=core.harbor.sopes --docker-username=sopes1 --docker-password='952-WOp0m$7t' --docker-email=bouquet.zoom.6h@icloud.com --dry-run=client -o yaml > harbor-login-secret.yaml
```

### Following three sections are incorrect solution
Chatgpt suggested these solutions but it didn't know they don't solve the problem. What it does is actually a DNS only for pods inside the cluster, this means we create a local DNS that works well after a pod is up and running however our need is something different, what happens is that the component in charge to pull images to a container is "kubelet" and it doesn't use the DNS solutions we mentioned in the following two sections, but after some investigation I found out that kubelet uses the underlying OS DNS configurations, in Linux they are usually located in "/etc/resolv.conf" and we can simulate a local DNS by editing file `/etc/hosts` so we need a way to add the certificate and simulate the DNS, I explained the solutions in previous sections.

### Simulate a DNS inside the cluster(All these options are not the right solution but they are vey educative)
We have a problem, when we create a container, either inside a pod or deployment, and pull from Harbor it will fail as in our case we don't actually have a DNS and Kubernetes makes an https call that fails because of it, so we need to fix this by doing something similar to what we are doing in our local computer, simulate a DNS. In Kubernetes we have at least four options

1. using use the Kubernetes "hostAliases" but we would have to define it manually on each Kubernetes object 

2. This might be the preferred as it solves the DNS cluster wide, using coreDNS

3. Use the private registry service directly, this implies us tracking down and identify the service we need to reach and in the image field in the container do something like `image: <service-name>.<namespace>.svc.cluster.local/<repository>:<tag>` but also we would need to modify the secret we created to in the `docker-server` field

4. Run a local DNS proxy pod like "dnsmasq" which is a very lightweight one and make it map a fake domain to the Ip address we need and then update the "dnsconfig" of all pods to use that pod as the DNS server

### Using CoreDNS
CoreDNS is the new option to to cluster DNS, previously only Kube-dns existed. Be aware most of cloud providers still use Kube-ds as the default option which is not the case of the official Kubernetes distro. We will install it using helm, we can search helm chart in "artifacthub" using the command `helm search hub <name>`, we will follow documentation from the [official repo](https://github.com/coredns/helm). I will also follow [this guide](https://medium.com/@protonex901/using-coredns-on-gke-2b3116300a37)

1. `helm repo add coredns https://coredns.github.io/helm`

2. `helm --namespace=kube-system install coredns coredns/coredns`, This creates some object but we are interested in the service of type "cluster ip" created for coredns, so copy the ip address of this service by pulling it with `kubectl get svc -n kube-system`

3. We need to configure kube-dns to use coreDNS when responding to our private registry calls so we have to edit kube-dns's config map. The confi map for kube-dns exposes two configuration options, one is **stubDomains** which is a map of DNS suffix keys to DNS IPs and the other is **upstreamNameservers** which has additional nameservers, we will use the stubs to redirect the calls to the private registry to coredns. run `kubectl edit configmap kube-dns -n kube-system` and just add to it and the resulting yaml file would look like the following:
```yaml
apiVersion: v1
data: # add this section
  stubDomains: |
    {
      "core.harbor.sopes": [
        "34.118.239.234" # your coredns service cluster ip (from step 1)
      ]
    }
kind: ConfigMap
metadata:
  creationTimestamp: "2024-06-03T00:00:0Z"
  labels:
    addonmanager.kubernetes.io/mode: EnsureExists
  name: kube-dns
  namespace: kube-system
  resourceVersion: "1234567"
  uid: some-random-uid
```

4. Restart kube-dns pods to reload the ConfigMap, you'll have to delete the pods so they can be recreated. Find the pods you need to delete with `kubectl get pods -n kube-system -l "k8s-app=kube-dns"` and delete them with `kubectl delete pod <pod_name> -n kube-system`

5. Edit the file, which is know as "corefile", that coredns uses to get its configurations with `kubectl edit configmap coredns coredns -n kube-system` and add the following. Note we are redirecting to harbor-core service, I found it by tracking down the ingress that harbor creates and found out that this is the service that handles pulls and pushes to registry, also see the format to get the IP address is this <service-name>.<namespace>.svc.cluster.local. To see more info about the configurations [look here]():
```yaml
      core.harbor.sopes:53 {
          errors
          cache 30
          health {
              lameduck 5s
          }
          log
          rewrite name regex (.?)core.harbor.sopes  harbor-core.project.svc.cluster.local
          forward . /etc/resolv.conf
      }
```


    Corefile: |-
      .:53 {
          log
          errors
          health {
              lameduck 5s
          }
          ready
          kubernetes cluster.local in-addr.arpa ip6.arpa {
              pods insecure
              fallthrough in-addr.arpa ip6.arpa
              ttl 30
          }
          prometheus 0.0.0.0:9153
          forward . /etc/resolv.conf
          cache 30
          loop
          reload
          loadbalance
          hosts {
              34.57.250.18 core.harbor.sopes
              fallthrough
          }
      }

6. `kubectl -n kube-system rollout restart deployment coredns`


### Debuggin DNS
Follow [this tutorial](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/). It is important to know `/etc/resolv.conf` is the file in all containers running in the cluster which indicates how will resolve DNS so you could do `kubectl exec -ti <pod_name> -- cat /etc/resolv.conf`,

Check with nslookup tool, install a pod with those utilities like `kubectl run --restart=Always --image registry.k8s.io/e2e-test-images/agnhost:2.39 dnstools`. Look up dns `kubectl exec -ti dnstools -- nslookup <service_name>.<namespace(optional if not in same ns)>`. `kubectl exec -ti dnstools -- host kubernetes`

If fails check logs of kube-dns and coreds pods


### Create deployments
All will follow a similar process, create the yaml file to run configurations from this file. check the pods are healthy. Create the service that will expose the deployment objects inside the cluster and namespace most of it will be a ClusterIP

#### Redis

1. Start the base configurations with command below and then define the container port and container resource limits
```yaml
`kubectl create deployment sopesredis --replicas=1 --image=redis:8.0-M02-alpine3.20 --dry-run -o yaml > sopes_redis.yaml`
```

2. `kubectl get pods -n project`

3. `kubectl expose deployment sopesredis -n project --port=6379 --target-port=6379 --type=ClusterIP --dry-run -o yaml > sopes_redis_svc.yaml`, check the services exists `kubectl get svc -n project`

4. `kubectl autoscale deployment sopesredis -n project --min=1 --max=3 --cpu-percent=50 --dry-run -o yaml > sopes_redis_hpa.yaml` add the HPA(horizontal pod autoscaler). make sure it has the namespace in the metadata section. , checkt the hpa exists `kubectl get hpa -n project`

5. `kubectl exec -it <pod_name> -n project -- redis-cli`

#### Mongo

1. Create a Persitent Volume Claim, find the documentation. WE just need a basic set up, it will be an opaque storage claim. The configurations I used are in the file "mongo_pvc.yaml". Just do `kubectl create -f mongo_pvc.yaml` to create the resource

2. You will see this pending when doing a `kubectl get pvc -n project`, if you do a `kubectl describe pvc -n project` or `kubectl describe pvc/mongo-pvc -n project` or `kubectl logs pvc/mongo-pvc -n project`

3. Start the base configurations with command below and then define the container port and container resource limits and then create it
```yaml
`kubectl create deployment sopesmongo -n project --replicas=1 --image=mongo:8.0.4 --dry-run -o yaml > sopes_mongo.yaml`
```

4. `kubectl expose deployment sopesmongo -n project --port=27017 --target-port=27017 --type=ClusterIP --dry-run -o yaml > sopes_mongo_svc.yaml`, check the services exists `kubectl get svc -n project` 

5 `kubectl autoscale deployment sopesmongo -n project --min=1 --max=3 --cpu-percent=50 --dry-run -o yaml > sopes_mongo_hpa.yaml` add the HPA(horizontal pod autoscaler). make sure it has the namespace in the metadata section. , check the hpa exists `kubectl get hpa -n project`

6. Run mongosh, enter CLI `kubectl exec -it sopesmongo-<id> -n project -- bin/sh`

#### Install Kafka Broker using Strimzi
Follow [this](https://strimzi.io/quickstarts/) simple guide. Just build `kafka` and `cluster` yamls with `kubectl create -f <name>.yaml`, for the moment don't create the topic "manually" as according to strimzi documentation the operator creates a topic automatically when it receives a message and it doesn't exists. I modified the original quickstart files to be created in my namespace

* kubectl create -f 'https://strimzi.io/install/latest?namespace=project' -n project

* kubectl apply -f https://strimzi.io/examples/latest/kafka/kraft/kafka-single-node.yaml -n project

kubectl wait kafka/my-cluster --for=condition=Ready --timeout=300s -n kafka 

quay.io/strimzi/operator:latest

`kubectl get strimzi -o name` : Listing all resource types and names
`kubectl -n project delete $(kubectl get strimzi -o name -n project)`: delete cluster
`kubectl delete pvc -l strimzi.io/name=my-cluster-kafka -n project`: delete cluster persistent volume claim
`kubectl -n kafka delete -f 'https://strimzi.io/install/latest?namespace=project'`: delete operator

* `kubectl get kafka my-cluster -o=jsonpath='{.status.listeners[?(@.name=="tls")].bootstrapServers}{"\n"}' -n project` tls can be "plain": get address to connect to cluster mine is `my-cluster-kafka-bootstrap.project.svc:9092` if not `my-kafka-bootstrap-address:9092`

#### Kakfa Client

1. Start the base configurations with command below and then define the container port and container resource limits
```yaml
`kubectl create deployment sopeskafkaclient --replicas=1 --image=juan523/kafkaclient --dry-run -o yaml > sopes_kafa.yaml`
```

2. `kubectl get pods -n project`

3. `kubectl autoscale deployment sopeskafkaclient -n project --min=1 --max=3 --cpu-percent=50 --dry-run -o yaml > sopes_kafka_hpa.yaml` add the HPA(horizontal pod autoscaler). make sure it has the namespace in the metadata section. , checkt the hpa exists `kubectl get hpa -n project`

5. `kubectl exec -it <pod_name> -n project -- bin/sh`

#### Main Deployment (gRPC server and client and Rust redis client)

1. Start the base configurations with command below and then define the container port and container resource limits
```yaml
`kubectl create deployment d-api-rest-grpc -n project --replicas=1 --image=juan523/clientgrpc --dry-run -o yaml > sopes_deploy.yaml`
```

4. `kubectl expose deployment d-api-rest-grpc -n project --port=80 --target-port=8100 --type=ClusterIP --dry-run -o yaml > sopes_deploy_svc.yaml`, check the services exists `kubectl get svc -n project` 

5 `kubectl autoscale deployment d-api-rest-grpc -n project --min=1 --max=3 --cpu-percent=50 --dry-run -o yaml > sopes_deploy_hpa.yaml` add the HPA(horizontal pod autoscaler). make sure it has the namespace in the metadata section. , checkt the hpa exists `kubectl get hpa -n project`

6. `kubectl describe pod d-api-rest-grpc-adfasd -n project` to get messages of other pods, or log `kubectl logs d-api-rest-grpc-67975b94b9-clmbh -n project`

Run mongosh, enter CLI `kubectl exec -it sopesmongo-<id> -n project -- bin/sh`
 
## Configure ORAS
Registries are evolving as generic artifact stores. ORAS is a technology that lets us create OCI artifacts and push and pull them form OCI registries. I followed the [official documentation](https://oras.land/docs/installation/) to install it, produce an OCI artifact from the JSON file containing the courses/assignations information to push it to our Harbor registry and then consume it from locust

1. I'm using git bash in windows. `curl -sLO  https://github.com/oras-project/oras/releases/download/v1.2.2/oras_1.2.2_windows_amd64.zip`


2. unzip it `tar -xvzf oras_1.2.2_windows_amd64.zip`


3. Add the directory address containing the .exe file to your PATH variable


4. In our set up the https certificate does not handle TLS certificates as it is not configured in a cloud provider so we need to do something similar as we did with Docker. In this case we need to see the [following guide](https://oras.land/docs/compatible_oci_registries/#using-a-plain-http-docker-registry) which explains how to interact with http registries(AKA insecure registries). Basicallly to any pull, push or login command append the `--insecure` flag


5. Login to oras using the registry `oras login [flags] <registry>` so in my case I will do a `oras login 35.223.33.184.nip.io --insecure -u sopes1` and enter password "!\09IZbZ$3pC". I can also do the plain http `oras login 35.223.33.184 --insecure -u sopes1`. (alternative) `oras login core.harbor.sopes -u sopes1` with password `952-WOp0m$7t`


6. The first thing we will push to Harbor in an OCI format is the json file in the locust directory. `oras push --insecure 35.223.33.184.nip.io/sopes1/courses:latest courses.json`. This command could repacle `--insecure` tag with the `--plain-http` tag and push it using the IP address `oras push --insecure core.harbor.sopoes/sopes1/courses:latest courses.json`. (alternative) `oras push --insecure core.harbor.sopes/sopes1/courses:latest courses.json` 

7. To test this we could delete the json file and then run `oras pull --insecure 35.223.33.184.nip.io/sopes1/courses:latest`. (alternative) `oras pull --insecure core.harbor.sopes/sopes1/courses:latest`

### Setting up Redis
I followed the tutorial [https://kubernetes.io/docs/tutorials/configuration/configure-redis-using-configmap/] to configure redis. Grafana will require us to match a password, the default user name is "default" password is empty so we could actually connect just entering an empty password but I changed this behavior in the config file so we need to create a Kubernetes configmap and pass this configurations to redis container by mounting a volume in the right path. Just build all objects with `kubectl create -f <file_name>`. We could do these configurations by accessing the container cli and run `redis-cli` command to access redis and then use some of the following commands

CONFIG GET requirepass                                            // for default user
CONFIG SET requirepass "course"                                   // for default user, initial value is empty string ""
CONFIG GET *                                                      // list of configurations
AUTH <user_name> <password>                                       // authenticates user
ACL LIST                                                          // see access list info, make sure user is on or user will not be able to authenticate
ACL SETUSER sop on +@admin allcommands allkeys allchannels >sop   // see [here](https://redis.io/docs/latest/commands/acl-setuser/)
info modules                                                      // checks modules installed

I used this command to create the secret

`kubectl create secret generic redis-secret --from-literal=user=sopes --from-literal=password=sopes -n project --dry-run=client -o yaml > user-secret.yaml`

Note that according to [this official documentation](https://redis.io/docs/latest/operate/oss_and_stack/management/config-file/) to read the configuration file Redis must be started with the file path as first argument and we also we need to load modules, that is why we include this command in the container:

`./redis-server /path/to/redis.conf`

### Setup Grafana

#### Create a TLS certificate
Using the private CA I created in [this section](#using-elliptic-curve-key-algorithm) run the following commands

* Generate a private key and CSR. note that "grafana.sopes" is the domain I want to authenticate, even thought a certificate can be used for several domains is better not to same public key across different domains so I'm creating a new one, an example of how to use it in more domains is in the "Making an .cnf file". Note `-noenc`, this option is used to avoid encrypting private key because Kubernetes doesn't support encrypted private keys: `openssl req -newkey ec:ecp.pem -noenc -keyout grafana-key.pem -out grafana-req.pem -subj "/C=GT/ST=Guatemala/L=Guatemala/O=okik.tech/OU=sopes1/CN=grafana.sopes/emailAddress=hg@icloud.com"`

* You can find an example of a ".cnf" file in the best practices section which is below in this document. Sign  request: `openssl x509 -req -in grafana-req.pem -days 360 -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out grafana-cert.pem -extfile grafanacerconfigs.cnf`

* Create secret to store certificate `kubectl create secret tls grafana-tls -n project --key grafana-key.pem --cert grafana-cert.pem -o yaml --dry-run=client > grafana-tls-secret.yaml`, encrypt private certificate authority to base 64 and add it to this file unde `ca.crt`

* Create secret with `kubectl create -f`

#### Install Grafana Using Helm
1. helm repo add grafana https://grafana.github.io/helm-charts
2. helm repo update
3. `helm fetch harbor/harbor --untar`, this generates a grafana directory with the "values.yml" file
4. Edit the values file with values you want, I added the ingress info
5. `helm install grafana grafana -n project`

#### Login and create charts
* `helm install grafana grafana -n project ` to get instructions to login if you didn't read them when installation completed
* I got this command to get my password `kubectl get secret --namespace project grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo` using admin username
* Go to "connections/add new connection" section, search and add "redis" on right top when it is installed click "add new data source" 

Follow [official documentation](https://grafana.com/docs/grafana/latest/setup-grafana/installation/kubernetes/), I decided to use yaml scripts to install it but you can use a helm chart. So once you copy the files just run `kubectl create -f <file_name>` for each of them

## Debugg the cluster

### Redis

* `kubectl exec -ti sopesredis-88cb8fb76-qwklc -n project -- sh`
* `redis-cli`
* `keys *`
* `JSON.GET region $`
* `JSON.GET region $.METROPOLITANA`
* `flushdb`
* `ACL LIST`
* `JSON.OBJKEYS Ingenieria . $`
* `JSON.ARRLEN Ingenieria $.*`
* `JSON.ARRLEN Ingenieria Civil $`
* `JSON.ARRLEN Ingenieria Civil`
* `JSON.ARRLEN Ingenieria $.Civil`
* .....etc

### Mongo

* `kubectl exec -ti sopesmongo-7567f8cc85-jpsqg -n project -- bash`
* `mongosh`                       // start mongosh cli
* `show dbs`                      // show databases
* `use Course`                    // selects database
* `db.Assignations.find()`        // shows all 
* `db.dropDatabase()`             // clears all values in selected db

### Kafka consumer

* `kubectl logs sopeskafkaclient-6bc7c96454-phqzd -f -n project`

### Deployments Containers
Each deployment is assigned a default container and we can get logs as usual

* `kubectl logs <pod_name> -n project`

 But to get logs of other containers in the deployment attach a `-c <contatiner_name>`

* `kubectl logs <pod_name> -c <container_name> -n project`


mongo and redis doesn't have to be exposed they can be just set up with a port forward in Kubernetes so they can be reached within the network

## Set up Grafana
* `docker run -d --name=grafana -p 3000:3000 grafana/grafana` if you want to test a local container

## List of Environment Variables

```
GRPC_CLIENT_HOST=<kubernetesObjectTag>
GRPC_CLIENT_PORT=8000 
GIN_MODE=release

# this is the Kafka producer:
GRPC_SERVER_HOST=<kubernetesObjectTag>
GRPC_SERVER_PORT=8010

# this is the Golang Kafka consumer and mongo client:
KAFKA_SERVER_HOST=<kubernetesObjectTag>
KAFKA_SERVER_PORT=9092

# this is the redis_client:
RUST_SERVER_HOST=<kubernetesObjectTag>
RUST_SERVER_PORT=8020
REDIS_USERNAME=sopes
REDIS_PASSWORD=sopes

RUST_REDIS_HOST=<kubernetesObjectTag>
RUST_REDIS_PORT=6379

MONGO_SERVER_HOST=<kubernetesObjectTag>
MONGO_SERVER_PORT=27017
```

```bash
export GRPC_CLIENT_HOST=localhost \
export GRPC_CLIENT_PORT=8000 \
export GRPC_SERVER_HOST=localhost \
export GRPC_SERVER_PORT=8010 \
export RUST_SERVER_HOST=localhost \
export RUST_SERVER_PORT=8020 \
export REDIS_USERNAME=sopes \
export REDIS_PASSWORD=sopes \
export RUST_REDIS_HOST=localhost \
export RUST_REDIS_PORT=6379 \
export KAFKA_SERVER_HOST=localhost \
export KAFKA_SERVER_PORT=9092 \
export MONGO_SERVER_HOST=localhost \
export MONGO_SERVER_PORT=27017
```

## Make a local post to gRPC client:
```
curl http://localhost:8000/course \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"curso": "ANP", "facultad": "Ingenieria", "carrera": "Civil", "region": "METROPOLITANA"}'
```

This can be included when running docker images locally

`-e GRPC_CLIENT_HOST=localhost -e GRPC_CLIENT_PORT=8000 -e GIN_MODE=release -e GRPC_SERVER_HOST=localhost -e GRPC_SERVER_PORT=8010 -e KAFKA_SERVER_HOST=localhost -e KAFKA_SERVER_PORT=9092 -e RUST_SERVER_HOST=localhost -e REDIS_USERNAME=sopes -e REDIS_PASSWORD=sopes -e RUST_SERVER_PORT=8020 -e RUST_REDIS_HOST=localhost -e RUST_REDIS_PORT=6379 -e MONGO_SERVER_HOST=localhost -e MONGO_SERVER_PORT=27017`

## Randm Notes

* Google sign in is now FedCM(federated credential management)

* Admission webhooks, or webhooks in Kubernetes, are a type of admission controller, which can be used in Kubernetes clusters to validate or mutate requests to the control plane prior to a request being persisted.


`helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  -n project`

## Uninstall Nginx-controller completely
To completely delete Nginx-controller from a Kubernetes cluster delete all nodes in of the following types called `ingress-nginx`

```
pod
svc
deployment
clusterrolebinding
clusterrole
IngressClass
ValidatingWebhookConfiguration
```


## Make Real Post Request to servers

curl https://34.174.102.23.nip.io/course \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"curso": "SA", "facultad": "Ingenieria", "carrera": "Civil", "region": "METROPOLITANA"}'


## install certmanager
I'll do what they call a static installation, you can modify this installation files or do a helm installation, using [this guide](https://cert-manager.io/docs/installation/). cert-manager mainly uses two different custom Kubernetes resources - known as CRDs - to configure and control how it operates, as well as to store state. These resources are Issuers and Certificates. We can see it is important to [use same namespace in this resources](https://cert-manager.io/docs/tutorials/acme/nginx-ingress/#issuers). Issuers are namespace specific but if using ClusterIssuer(cluster wide), remember to update the Ingress annotation cert-manager.io/issuer to cert-manager.io/cluster-issuer

* `kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.2/cert-manager.yaml`

[create an issuer using this instructions](https://cert-manager.io/docs/tutorials/getting-started-with-cert-manager-on-google-kubernetes-engine-using-lets-encrypt-for-ingress-ssl/#7-create-an-issuer-for-lets-encrypt-staging)

[create a secrete](https://cert-manager.io/docs/tutorials/getting-started-with-cert-manager-on-google-kubernetes-engine-using-lets-encrypt-for-ingress-ssl/#8-re-configure-the-ingress-for-ssl) of tls type with empty values

update the harbor "values.yaml" file to use the secret name we created in previous step `expose.tls.secret.secretName`. also include the domain name of your choice in `expose.ingress.hosts`, also `externalURL` to use the same domain when calling https. We actually will not buy a domain nor set up a DNS instead we are aiming to generate the certificates using certmanager and do a local DNS in our computers


34.57.250.18 core.harbor.sopes


kubectl create secret tls hello-app-tls \
    --namespace dev \
    --key server.key \
    --cert server.crt \
    --dryk-run \
    -0 yaml > setest.yaml


* `curl -kivL -H 'Host: core.harbor.sopes' 'http://34.57.250.18'`: this curl command will provide verbose output, following any redirects, show the TLS headers in the output, and not error on insecure certificates. With ingress-nginx-controller, the service will be available with a TLS certificate, but it will be using a self-signed certificate provided as a default from the ingress-nginx-controller

* If you want to download and look at the files for a published chart, without installing it, you can do so with helm pull chartrepo/chartname 

## Uninstalling Cert-manager
Check [this guide[(https://cert-manager.io/docs/installation/kubectl/#uninstalling)

* `kubectl describe certificate -n cert-manager-test`


* `--all-namespaces`: this can be used with any delete or get action
* `--edit`: We can use this option before a `-f` option for example when creating from a file either from the internet or local


* An S/MIME certificate is a digital certificate used to secure email communication1. It verifies your identity to recipients and ensures that your messages remain private and integral.


golang goa vs openapi(code generator/design first APIs) an alternative to code first libraries like gin or gorilla


# Self-signed TLS Certificates

## [First](https://dev.to/techschoolguru/how-to-create-sign-ssl-tls-certificates-2aai)(Preferred)
This is great tutorial to follow as it uses an internal CA to issue internal certificates which is what is recommended as a best practice. However we will combine it with elliptic curve keys, which openssl can also generate. For that you can follow [this tutorial](https://www.geeksforgeeks.org/blockchain-creating-elliptic-curve-keys-using-openssl/). I decided to use those type of keys as they are supposedly more performant.

* Generate a private key and its self-signed certificate for the CA. They will be used to sign the CSR later
```
openssl req -x509 -newkey rsa:4096 -days 365 -keyout ca-key.pem -out ca-cert.pem -subj "/C=GT/ST=Guatemala/L=Guatemala/O=okik.tech/OU=sopes1/CN=okik-tech/emailAddress=hg@icloud.com"
```

* Generate a private key and its paired CSR for the web server that we want to use TLS.
```
openssl req -newkey rsa:4096 -keyout server-key.pem -out server-req.pem -subj "/C=GT/ST=Guatemala/L=Guatemala/O=okik.tech/OU=sopes1/CN=okik.tech/emailAddress=hg@icloud.com"
```

* Use the CA’s private key to sign the web server’s CSR and get back the signed certificate
```
openssl x509 -req -in server-req.pem -days 60 -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile server-ext.cnf

openssl x509 -in some-cert.pem -noout -text
```

### Using Elliptic Curve Key Algorithm
We will do same as above but using this other Algorithm

* choose a curve from list: `openssl ecparam -list_curves`

* Generate elliptic curve algorithm parameters: `openssl genpkey -genparam -algorithm EC -out ecp.pem \
       -pkeyopt ec_paramgen_curve:P-256 \
       -pkeyopt ec_param_enc:named_curve`

* Generate private key and its self-signed certificate for the CA. The private key will be encrypted using the pass phrase we enter, a conf file can be found called "caconfigs.cnf" declaring extensions: 
```
`openssl req -x509 -newkey ec:ecp.pem -days 365 -keyout ca-key.pem -out ca-cert.pem -subj "/C=GT/ST=Guatemala/L=Guatemala/O=okik.tech/OU=sopes1/CN=okik.tech/emailAddress=hg@icloud.com" \
-addext "basicConstraints = critical, CA:true" \
-addext "keyUsage = critical, digitalSignature, keyEncipherment, keyCertSign" \
-addext "extendedKeyUsage = serverAuth, clientAuth" \
-addext "authorityKeyIdentifier = none" \
-copy_extensions copyall`
```

* Generate a private key and CSR. note that "core.harbor.sopes" is the domain I want to authenticate, however we can use the same certificate for more domains, an example of how to use it in more domains is in the "Making an .cnf file". Note `-noenc`, I will explain this at the end of these commands: `openssl req -newkey ec:ecp.pem -noenc -keyout server-key.pem -out server-req.pem -subj "/C=GT/ST=Guatemala/L=Guatemala/O=okik.tech/OU=sopes1/CN=core.harbor.sopes/emailAddress=hg@icloud.com"`

* You can find an example of a ".cnf" file in the best practices section which is below in this document. Sign  request: `openssl x509 -req -in server-req.pem -days 60 -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile cerconfigs.cnf`

* Change the extensions. So public keys can also be called certificates, but to get an https connection we also need a private key. We produced some ".pem" files, in our case the public key/certificate and the private key live in a separated pem file(they could live in the same pem file), so our public key/certificate we'll change to a ".crt" extension and for our private key change it to ".key" extension. Note that to install a certificate in windows you have to use the ".crt" file extension.

### PEM vs DER
Both are X.509 certificates formats/encodings. PEM format files(private keys, certificates/public keys) have a header while DER not. PEM files can contain in a single file the certificate/public key and the private key. PEM files use extensions like ".crt", ".cer", ".key"(for private keys) or ".ca-bundle". DER are commonly used in a Java context. DER files usually use files extensions ".cer" and ".der". Both can be parsed/converted to the other format using openssl

#### View PEM and DER files content
Using openssl you can do this with any of the format types extensions using openssl's "x509":

* PEM files and extensions: `openssl x509 -text -noout -in CERTIFICATE.pem `

* DER files and extensions: `openssl x509 -text -noout -inform der -in CERTIFICATE.der`


## [Second](https://passwork.pro/blog/openssl/)

* Generate a Public/Private keypair. 2048– key size
```
openssl genrsa - out passwork.key 2048
```

* extract the public key
```
openssl rsa -in passwork.key -pubout -out passwork_public.key
```

* proceed to creating a CSR In a real production scenario, such a CSR is forwarded to the CA which signs it on your behalf, so you get a certificate. we’ll create a CSR and self-sign it.
```
openssl req -new -key passwork.key -out passwork.csr

openssl req -text -in passwork.csr -noout -verify
```

* create a self-signed certificate
```
openssl x509 -in passwork.csr -out passwork.crt -req -signkey passwork.key -days 30
```




## [Third](https://dev.to/gauravgahlot/secure-your-kubernetes-applications-with-self-signed-certificates-jfj#:~:text=Following%20are%20the%20steps%20to%20generate%20the%20self-signed,req%20command%20with%20the%20-subj%20and%20-addext%20options%3A)

* Generate an RSA private key
```
openssl genrsa -out tls.key 4096
```

* Generate a CSR (Certificate Signing Request)
```
 openssl req -new -key tls.key -out tls.csr \
    -subj "/CN=todo-app" -addext \
    "subjectAltName=DNS:todo-app.default.svc.cluster.local,DNS:localhost,DNS:todo-app"
```

* Generate the Self-Signed Certificate
```
openssl x509 -req -days 365 -in tls.csr -signkey tls.key \
    -out tls.crt -extensions req_ext \
    -extfile <(printf "[req_ext]\nsubjectAltName=DNS:todo-app.default.svc.cluster.local,DNS:localhost,DNS:todo-app")

openssl x509 -in tls.crt -text -noout
```

## [Self-signed Certificates best practices](https://myarch.com/self-signed-certificates-best-practices/?ref=passwork.pro/blog)

* Use elliptic curve keys as opposed to the default RSA ones, they provide a number of benefits over RSA

* You can make your certificate more robust by specifying the certificate’s purpose using extended key usage and “key usage” extensions. “TLS Web Server Authentication” should be the only allowed usage for a server. This will prevent unintended use of the certificate.

* Using an internal CA for issuing all internal certificates is a much better option

## Making an .cnf file
[Here](https://man.openbsd.org/x509v3.cnf.5) is the documentation. In this document you can request things like client certificate authentication or to enable a certificate/public key to be used in several domain names/websites using the "subjectAltName" extension, however using the same public key/certificate in several domains could be considered a bad practice

```
[ extensions ]
basicConstraints = critical, CA:FALSE
keyUsage =critical, digitalSignature, keyEncipherment
extendedKeyUsage = critical, serverAuth
subjectKeyIdentifier = hash
subjectAltName = @alt_names
 
[ alt_names ]
DNS.1 = host1
DNS.2 = host2
```

`curl -kv https://core.harbor.sopes`


addonmanager.kubernetes.io/mode: EnsureExists


## Interesting Kubernetes commands

* `kubectl get svc s-api-rest-grpc -n project -o yaml`

* `kubectl config set-context --current --namespace=<namespace_name>`

