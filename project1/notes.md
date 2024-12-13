# Project
We will install an resource observer agent in VM created in GCP, this will monitor resource, and processes usage and this will be made with Golang, this program will execute some Kernel modules that will be installed which were built with C. These modules will give the agent written in golang all the system resources info, this info will be sent to some API services written with Node and expresso.js. Expresso is very famous, it works great for simple and small projects, it provides routing and middleware, but it lacks of some essential functions for web applications like authentication, authorization, validation, testing, logging, etc, which that are very important in larger applications but for this project it works very well. These services will receive objects with the resources info and will forward it to a database server, the ip address of this database will be entered in Grafana, and we will log in to the DB from here to then make queries to be able to see the info through a client accessing the IP address of the Grafana server. So a GCP VM instance will have three containers, one for Grafana, other for APIs written with node and the MySQL server. Then another container wich will be created through an "Instance Group" which will be configure to be elastic, each VM in this group will have a container with the monitoring agent installed, remember the the virtualization technique containers use is OS virtualization this means they don't have a kernel and they depend on the kernel of the host machine and that is why a container with the module we created can access the actual host resources and process info. Linux Kernel uses CGROUPS to manage the resources that will be assigned virtually to the container(RAM and Hard Drive Space)

# Build REST API, Database and Monitoring Agent
Our backend will have just two queries at the beginning, it will accept two posts methods. One post with a Json with RAM info and the other with a Json with CPU info

1. Create a project [following this instructions](https://dev.to/jaimaldullat/a-step-by-step-guide-to-creating-a-restful-api-using-nodejs-and-express-including-crud-operations-and-authentication-2mo2), you can also check the [official documentation](https://expressjs.com/en/starter/installing.html) there you can find pretty much the same instructions and a few tutorials later you will find the routing tutorials which we will need when we build the endpoints.

2. We need to create a script for our database, we have two options to get the SQL runtime environment to develop our script over, we can get it by installing SQL server locally in our computers or download a docker container, since we already have docker we will use a container with SQL server installed and use a DB client administration tool called DBeaver.

	* we need to separate processes, cpu and ram by a VM id for that we will use the VM IP address and we need to store the date to the able to also sort them by date

	* We need three objects, both will have an IP to identify the VM they belong to and a date to be sorted historically, the three objects are: CPU_usage, RAM_usage and process

3. Download a container with SQL server installed

RAM json structure

[ways to get the client's IP address in node](https://www.abstractapi.com/guides/ip-geolocation/how-to-get-a-client-ip-address-in-node-js)

https://cloud.google.com/build/docs/build-config-file-schema