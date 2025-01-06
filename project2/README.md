# Description
In this project we are going to use Locust(python library) to send traffic to a Kubernetes Ingress controller which
is a Kubernetes service that has Linkerd installed, we will configure 2 routes using Linkerd, each will receive 50% 
of the traffic, both will transfer data to a database. First route will be sending traffic to a gRCP client written 
in Golang that sends it to a gRCP server written in Golang as well, this server has a connection to a Mongo data base
and writes it. Second route is written in Rust, is server that is connected to a redis and the mongo database it writes
the information received to both databases. Each of these 'routes' will be a Kubernetes deployment object, and will have
a minimun of 1 and maximun of 3 replicas and the CPU usage should not be more than 50%. The data that is going to be 
transmitted is collegue students notes, so we will display those notes by connecting a Grafana server to the databases 

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
We'll follow [official documentation]{https://go.dev/doc/tutorial/web-service-gin} tutorial to create the REST API using Golang. We assume you've installed Golang

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
export RUST_SERVER_PORT=8020
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
docker run -rm -d -it \
    --name=redis-server \
    -v redis-persistence:/data \
    -e REDIS_PASSWORD=course -e REDIS_MASTER_PASSWORD=course   \
    -p 6379:6379 \
    redis:8.0-M02-alpine3.20

docker ps # write down container id

docker exec -it <container_id> sh  # this start the alpines's command line

redis-cli  # access redis CLI to interact with Redis server
```

5. Search [here](https://redis.io/docs/latest/commands/) for JSON commands, remember we are storing JSON at very least we will use `JSON.GET `

6. Bellow is the logic using Redis commands to insert and read the info to and from Redis

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
We would have to figure out a way to do this just once but for the project it is fine to do this when rust server is initialized, in a real life scenario we could do it with a init container maybe 

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



#### Set up Kafka Producer and Consumer
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

In our case we just need to start a MongoDB server, while developing you can do that using Docker but we will do this using Kubernetes when deploying the app. Once it is started we can just talk to it using the client, at this moment no Database exists yet other than the default one called "test" so in order to create one just start making queries, if you do a create query of a document to a db and collection that doesn't exist the db and collection will be created ant the document will be stored in it.

https://www.mongodb.com/docs/drivers/go/current/
https://www.mongodb.com/resources/languages/golang
https://www.mongodb.com/docs/atlas/   # for GCP
https://www.mongodb.com/resources/languages/golang  # get started
https://www.mongodb.com/docs/drivers/go/current/quick-start/  # quick start
https://www.mongodb.com/resources/products/compatibilities/docker  # docker get started
https://github.com/mongodb/mongo-go-driver/blob/master/mongo/database.go#L48  # documentation
running mongodb as a microservice with docker and Kubernetes # navigator search
https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo

docker run -it --name mongodb -d -p 27017:27017 mongodb/mongodb-community-server:7.0.6-ubi9           mongosh

or

docker run --name mongo -d -p 27017:27017 mongo:8.0.4


## Install gcloud CLI and Kubectl
I followed [this documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) to install kubectl. I used the [official documentation](https://cloud.google.com/sdk/docs/install) and [this guide](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl) to install "gcloud CLI", this is a [gcloud CLI cheat sheet](https://cloud.google.com/sdk/docs/cheatsheet).
	* `gcloud auth login`: login to your GCP account
	* `gcloud container clusters get-credentials sopes1 --zone us-central1-c --project sopes1-444607`: connect to the cluster we created
	* `kubectl create namespace project`: Create a namespace `kubectl create ns project --dry-run -o yaml`

## Set up a DNS in GCP
We need a DNS to configure Harbor in next step

1. Follow [this guide](https://cloud.google.com/dns/docs/set-up-dns-records-domain-name)

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

### List of containers ports
This is a list of the ports that our images are exposing. Be aware I had to build my gRPC client image with the following code `docker build -f client/Dockerfile -t grpc_client .`

1. gRPC client: 8000
2. 



## Setting up Kubernetes

### Create a Kubernetes Cluster in GCP


### Install Helm
Install it using the [official documentation](https://helm.sh/docs/intro/quickstart/). Helm help us install packages to Kubernetes clusters, we'll use it in next section.


### Setting up Harbor(In Kubernetes cluster)
Follow [this guide](https://goharbor.io/docs/edge/install-config/harbor-ha-helm/) 

1. `helm repo add harbor https://helm.goharbor.io`

2. `helm fetch harbor/harbor --untar`, this generates a Harbor directory with the "values.yml" file

3. Edit "values.yml" you need to configure this `expose.ingress.hosts.core` and this `externalURL` to a domain name you want, we will use that domain name later, mine is `core.harbor.sopes` . Also set `tls.enable` to false. In `ingress.className` enter "nginx". In `persistance.persistentVolumeClaim.registry.storageClass`, `persistence.persistentVolumeClaim.jobservice.storageClass`, `persistence.persistentVolumeClaim.database.storageClass`, `persistence.persistentVolumeClaim.redis.storageClass`, `persistence.persistentVolumeClaim.trivy.storageClass` enter `standard-rwo` this will helps us persist harbors info using gke's default storage called `standard-rwo`. You'll access with `https://core.harbor.sopes` later

4. `helm install harbor harbor -n project`, check harbor is installed by checking it pods `kubectl get pods -n project`, `kubectl get services -n project`, `kubectl get pvc -n project`

5. Do `docker logout` if you're logged in to your docker account and then loging to docker `docker login core.harbor.sopes -u sopes1` with password `952-WOp0m$7t`

4. We have to create the ingress controller

#### Set up a Nginx Controller using Helm
Following [this documentation](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) will direct you [here](https://kubernetes.github.io/ingress-nginx/deploy/). We will use this controller to be able to expose the cluster with a DNS address and direct traffic to a Kubernetes object called Ingress, the controller is a load balancer. It only allows http and https traffic through port 80 and 443. We are basically following the sintax in [this section](https://kubernetes.github.io/ingress-nginx/deploy/#ovhcloud)

# 1. `kubectl apply -f https://raw.githubusercontent.com/nginxinc/kubernetes-ingress/v4.0.0/deploy/crds.yaml`: Installs CRDs
# 2. (optional) `kubectl delete -f crds/`: If you need to uninstall CRDs

1. `helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`: adds a repo to helm, it is similar to adding a source in Ubuntu's advanced package tool(apt), which is the Ubuntu's package manager

2. `helm repo update`

3. `helm install nginx-ingress ingress-nginx/ingress-nginx -n project`: Installs controller, basically this command means the following `helm install <give_installation_a_name> <repo_name>/<file_in_repo_name> -n <name_space_in_which_to_install_it>`. When installation ends you'll get an exammple copy that and paste it in a YAML file

4. `kubectl get ingressclass`: shows ingress controller info

5. Get the ingress contorller's External-IP/public IP with command `kubectl get svc -n project` and append `.nip.io` to the end if you want to know how this works check [their website](https://nip.io/), this will simulate a DNS for our IP address. then paste this in the `host` label of your YAML file. My external-ip address is `34.58.126.96`

6. Using [this](https://docs.nginx.com/nginx-ingress-controller/installation/ingress-nginx/#header-manipulation) and [this documentation](https://docs.nginx.com/nginx-ingress-controller/installation/ingress-nginx/#header-manipulation)

7. With the same external-ip address we now will create a local DNS, I'm windows, but is very similar in Unix systems. My external IP is `34.58.126.96`, Open `hosts` that lives in this address `C:\Windows\System32\drivers\etc` and paste `34.58.126.96 core.harbor.sopes`

### Create Harbor Project

1. Login with default user `admin` with default password `Harbor12345` you could have also change that in the `values.yml` file in previous sections. Change password to `952-WOp0m$7t`

2, Create a user with name `sopes1`, email `bouquet.zoom.6h@icloud.com`, fist/last name `sopes uno`, password `952-WOp0m$7t`

3. Create project called `sopes1`, leave it private, and in the members tab inside the project add the user we just created `sopes1` as administrator


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

1. Create a Persitent Volume Claim, find the documentation. WE just need a basic set up, it will be an opaque storage claim

2. You will see this pending when doing a `kubectl get pvc -n project`, if you do a `kubectl describe pvc -n project` or `kubectl describe pvc/mongo-pvc -n project` or `kubectl logs pvc/mongo-pvc -n project`

3. Start the base configurations with command below and then define the container port and container resource limits
```yaml
`kubectl create deployment sopesmongo -n project --replicas=1 --image=mongo:8.0.4 --dry-run -o yaml > sopesmongo.yaml`
```

4. `kubectl expose deployment sopesmongo -n project --port=27017 --target-port=27017 --type=ClusterIP --dry-run -o yaml > sopes_mongo_svc.yaml`, check the services exists `kubectl get svc -n project` 

5 `kubectl autoscale deployment sopesmongo -n project --min=1 --max=3 --cpu-percent=50 --dry-run -o yaml > sopes_mongo_hpa.yaml` add the HPA(horizontal pod autoscaler). make sure it has the namespace in the metadata section. , checkt the hpa exists `kubectl get hpa -n project`

6. Run mongosh, enter CLI `kubectl exec -it sopesmongo-<id> -n project -- bin/sh`

#### Install Kafka Broker using Strimzi
Follow [this](https://strimzi.io/quickstarts/) simple guide

kubectl create -f 'https://strimzi.io/install/latest?namespace=project' -n project


kubectl apply -f https://strimzi.io/examples/latest/kafka/kraft/kafka-single-node.yaml -n kafka

kubectl wait kafka/my-cluster --for=condition=Ready --timeout=300s -n kafka 

quay.io/strimzi/operator:latest

`kubectl get strimzi -o name` : Listing all resource types and names
`kubectl -n project delete $(kubectl get strimzi -o name -n project)`: delete cluster
`kubectl delete pvc -l strimzi.io/name=my-cluster-kafka -n project`: delete cluster persistent volume claim
`kubectl -n kafka delete -f 'https://strimzi.io/install/latest?namespace=project'`: delete operator
`kubectl get kafka my-cluster -o=jsonpath='{.status.listeners[?(@.name=="tls")].bootstrapServers}{"\n"}'` tls can be plain: get address to connect to cluster mine is `my-cluster-kafka-bootstrap.project.svc:9092` if not `my-kafka-bootstrap-address:9092`

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


5. Login to oras using the registry `oras login [flags] <registry>` so in my case I will do a `oras login 35.223.33.184.nip.io --insecure -u sopes1` and enter password "!\09IZbZ$3pC". I can also do the plain http `oras login 35.223.33.184 --insecure -u sopes1`. (alternative) `oras login core.harbor.sopes --insecure -u sopes1` with password `952-WOp0m$7t`


6. The first thing we will push to Harbor in an OCI format is the json file in the locust directory. `oras push --insecure 35.223.33.184.nip.io/sopes1/courses:latest courses.json`. This command could repacle `--insecure` tag with the `--plain-http` tag and push it using the IP address `oras push --insecure 35.223.33.184/sopes1/courses:latest courses.json`. (alternative) `oras push --insecure core.harbor.sopes/sopes1/courses:latest courses.json` 

7. To test this we could delete the json file and then run `oras pull --insecure 35.223.33.184.nip.io/sopes1/courses:latest`. (alternative) `oras pull --insecure core.harbor.sopes/sopes1/courses:latest`







In the cluster configuration in GCP in the networks section remove "enable authorized networks"
We can use Lens k8
mongo and redis doesn't have to be exposed they can be just set up with a port forward in Kubernetes so they can be reached within the network



`kubectl config set-context --current --namespace=<namespace_name>`

## Set up Grafana
`docker run -d --name=grafana -p 3000:3000 grafana/grafana`


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
export RUST_REDIS_HOST=localhost \
export RUST_REDIS_PORT=6379 \
export KAFKA_SERVER_HOST=localhost \
export KAFKA_SERVER_PORT=9092 \
export MONGO_SERVER_HOST=localhost \
export MONGO_SERVER_PORT=27017
```

        env:
          - name: SPRING_PROFILES_INCLUDE
            value: "kubernetes"
          - name: SPRING_PROFILES_INCLUDE
            value: "kubernetes"
          - name: SPRING_PROFILES_INCLUDE
            value: "kubernetes"
          - name: SPRING_PROFILES_INCLUDE
            value: "kubernetes"
          - name: SPRING_PROFILES_INCLUDE
            value: "kubernetes"
          - name: SPRING_PROFILES_INCLUDE
            value: "kubernetes"
          - name: SPRING_PROFILES_INCLUDE
            value: "kubernetes"

curl http://localhost:8000/course \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"curso": "ANP", "facultad": "Ingenieria", "carrera": "Civil", "region": "METROPOLITANA"}'


-e GRPC_CLIENT_HOST=localhost -e GRPC_CLIENT_PORT=8000 -e GIN_MODE=release -e GRPC_SERVER_HOST=localhost -e GRPC_SERVER_PORT=8010 -e KAFKA_SERVER_HOST=localhost -e KAFKA_SERVER_PORT=9092 -e RUST_SERVER_HOST=localhost -e RUST_SERVER_PORT=8020 -e RUST_REDIS_HOST=localhost -e RUST_REDIS_PORT=6379 -e MONGO_SERVER_HOST=localhost -e MONGO_SERVER_PORT=27017



* Google sign in is now FedCM(federated credential management)

* Admission webhooks, or webhooks in Kubernetes, are a type of admission controller, which can be used in Kubernetes clusters to validate or mutate requests to the control plane prior to a request being persisted.

helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  -n project

### Uninstall Nginx-controller completely
To completely delete Nginx-controller from a Kubernetes cluster delete all nodes in of the following types called `ingress-nginx`

pod
svc
deployment
clusterrolebinding
clusterrole
IngressClass
ValidatingWebhookConfiguration




kubectl create ingress -s -n project --dry-run -o yaml > ingress.yaml


# Create a single ingress called 'simple' that directs requests to foo.com/bar to svc
  # svc1:8080 with a TLS secret "my-cert"
  kubectl create ingress simple --rule="foo.com/bar=svc1:8080,tls=my-cert"

  # Create a catch all ingress of "/path" pointing to service svc:port and Ingress Class as "otheringress"
  kubectl create ingress catch-all --class=otheringress --rule="/path=svc:port"

  # Create an ingress with two annotations: ingress.annotation1 and ingress.annotations2
  kubectl create ingress annotated --class=default --rule="foo.com/bar=svc:port" \
  --annotation ingress.annotation1=foo \
  --annotation ingress.annotation2=bla

  # Create an ingress with the same host and multiple paths
  kubectl create ingress multipath --class=default \
  --rule="foo.com/=svc:port" \
  --rule="foo.com/admin/=svcadmin:portadmin"

  # Create an ingress with multiple hosts and the pathType as Prefix
  kubectl create ingress ingress1 --class=default \
  --rule="foo.com/path*=svc:8080" \
  --rule="bar.com/admin*=svc2:http"

  # Create an ingress with TLS enabled using the default ingress certificate and different path types
  kubectl create ingress ingtls --class=default \
  --rule="foo.com/=svc:https,tls" \
  --rule="foo.com/path/subpath*=othersvc:8080"

  # Create an ingress with TLS enabled using a specific secret and pathType as Prefix
  kubectl create ingress ingsecret --class=default \
  --rule="foo.com/*=svc:8080,tls=secret1"

  # Create an ingress with a default backend
  kubectl create ingress ingdefault --class=default \
  --default-backend=defaultsvc:http \
  --rule="foo.com/*=svc:8080,tls=secret1"


kubectl create deployment gotest-d --image=juan523/gotest --port=8000 --dry-run -o yaml > deploy.yaml

kubectl expose deployment gotest-d

kubectl expose deployment gotest-d --name=gotest-s --port=80 --target-port=8000 -n project --dry-run -o yaml > service.yaml

kubectl create ingress goingress --class=default --rule="foo.com/path*=svc:8080" --dry-run -o yaml > ingress.yaml

curl http://34.57.250.18.nip.io/course \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"curso": "ANP", "facultad": "Ingenieria", "carrera": "Civil", "region": "METROPOLITANA"}'


install certmanager
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
