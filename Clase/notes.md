# Class 1

## What is an OS?
Is a software, formed by group of programs/applications, that is in charge of managing and coordinating hardware use/access between several programs/applications and users, this is known and resource administration/management

An OS performs two main tasks that do very different things:

* OS as a resource manager
* OS as a virtual machine/extended machine

But also, to be able to understand an OS better we should study them from other two perspectives:

* OS as a process manager
* OS as a Hierarchic Machine

# Clase 2

Useful Linux commands: 
	```bash
	ps -ax # Displays a list of all process that are running
	kill <process name> # kills process
	top # shows memory usage, you can use PIDs to kill the process
	exit # exits an app running in the CLI
	uname -a # shows OS info
	 
	```

You can find Linux kernel headers in this folder: `/usr/src` so just do an `ls` when you're on this directory, headers have the libraries that you need to compile/recompile Kernel, here is where we could create a driver that interacts with some hardware, meaning we can extend the system by creating some header.

We can find the programs a list of programs Linux has at `/usr/bim` and do a `ls`.

We can find kernel at `usr/src/boot` do and `ls` or `ls -lsh` to see more info and find it as "vmlinuz-<version_number>" there could be two files with a similar name but kernel is the one that matches the name when seeing the system info with command `uname -a`

Find kernel modules in `/lib/modules/<kernel_name>/kernel/drivers` when programming in C we could use this drivers/libraries to basically interact with Kernel

### eBPF
Is a technology that lets us extend the capabilities of the kernel without requiring to change kernel source code or load kernel modules. This helps us centralize monitoring because we can create kernel packages to modify network traffic, again interactring and mainly extending the kernel is more easy with this tool. Would be very useful if used inside Kubernetes, since we can run/execute/manage a lot of applications is hard to monitor all of them in a centralized way but with this technology we can do it from the Kernel which not only makes it very efficient but also centralizes this task meaning we would have to modify a lot of applications

Alpine is Linux system, Docker Alpine versions are the most lighter versions most of the times

# Class 3

## Richard Stall Ted Talk "Free software, free society: Richard Stallman at TEDxGenava 2014"

Who controls our computer, us or a big company?. The computer is universal because it just does what is told to do, it receives instructions and execute them. If we write the right program we can make it do anything. The question is, who is giving the instructions to your computer?, it really is obeying somebody else first and only listens the user(you, me, us) as much as a big company lets it to. So with software there is only two options either the program controls the users or the users control the program. In order the user to control the program we need the four essential freedoms: freedom to execute/run, freedom  to study and change the source code both individually and collectively, Freedom to redistribute with changes, Freedom to distribute without changes if any of these is missing the program controls the user, its no free software. He mentions in minute 5:00 that **Windows has some sort of universal backdoor**, the backdoor is some malicious practice that a company/programmer could have built in into an OS or software. This means the program/OS is an instrument of unjust power for its developers over the users. Private software very often snoops, tracks, restricts user, they could remotely change something in your devices like deleting a file or similar, users have to compel to updates that contain code that violates user's privacy, Sony did something similar. They can change software remotely as Microsoft with Windows using their **universal backdoor**

After this statement I investigated and found this article that says it happed that some malware were installed at a very low level, it seems like the firmware of Gygabyte or ASUS motherboards firmware was replaced, how it happened is not clear, but possibly from the site that sold the hardware. This targeted Windows, basically the malicious program is so low level that it starts even before the OS is loaded into memory and even before the UEFI/BIOS is started this attacks the kernel and installs a series of hooks that basically ends up controlling/replacing some computers services or programs with malicious programs. They mention EFI drivers, which are the drivers that talks with the kernel, the malware basically installs some patch of a legit driver CSMOORE. [Read more](https://securelist.com/cosmicstrand-uefi-firmware-rootkit/106973/), or [here](https://www.gnu.org/proprietary/malware-microsoft.en.html), [monitor unwanted usage with powershell, NSA advices](https://www.bleepingcomputer.com/news/security/nsa-shares-tips-on-securing-windows-devices-with-powershell/)
 
5:00 He mentions that FOSS aims to give users control and safety because usually private software actually 

LibreJs extension for firefox that help avoid invasive JS software in the browsers

Unix fue donado a la universidad de Berklee y ahora se llama BSD(Berklee System Development) y se puede decir que es el UNIX puro

Open Source vs Free Software

Intellectual property are the copyrights/author rights over a code base, and copyleft are the 'oposite', they exists in things like free software. Queen's Anne status, this is part of the history of copyrights

Proprietary software is basically the contrary to free software and it lives within the opposite philosophy to open source

Shareware is software that may be free to use over a certain window of time and/or with limited functionality. Freeware is a free variant of shareware it has some terms and conditions on its use, like not modifying it however often you can redistribute it, both of these types would give you a license but the terms they impose are different. GNU GPL is a free, copyleft license, you can put this license to your code to guarantee is free software it is also a method to produce software that requires any variant produced from it to follow its specifications

Open source initiative, Linux Foundation is an open source guild(gremio). Open Source are the use implications but they are not 'phylosophical' like free software but free software.

Open source is the easiest way to make a program to be free(libre) and put it under a public domain without copyrights. This means Shareware and freeware are not the same as open source

Creative commons is an organizations that helps you register your work and create a license of use, most likely it will be for public access

LFX mentorship, Google summer and Outreachy are interships

# Class 4

## Minix
Is the first UNIX like SO, created by Andrew Tanenbaum, it is very old SO

### Multics
Is another old OS, the first high level language and the first DB, it handled persmissions based on MIOS, was made in this OS. 

### Operating Systems - Design and Implementation
Is a book that was written based on the experience of building Mimix

### More on Minix
Linux was developed based on Minix. Minix is a microkernel while Linux is a monolithic kernel

### Quick notes
* Linux is written in GCC
* Minix is written in ANSI Standard C
* Minix switch easily to Clang/LLVM
* Linux is still stuck with GCC
* Minix eventually became BSD, at the beginning it was proprietary software but ti was given to Beerkley's university so it became open source and free software
* Posix

## Kernel Types
Linux contains a Kernel which is a program/software that contains a set of instructions that lets us use hardware on the computer. the other part of an OS are the set of programs that let us interact with the hardware. There is 4 kernel types:

### Monolithic
Linux kernel is Monolithic, it means the Kernel live in one binary only, if we are adding more functionalities by adding new programs or modifying existing programs the whole kernel needs to be recompiled. If one component fails all the kernel fails. At the beginning Ubuntu was a monolithic kernel

### Modular
It lets the kernel execute compiled kernel objects dynamically without having to recompile the whole kernel. Ubuntu has a modular Kernel

### Microkernel
A kernel with basic functionalities, is capable to continue working even if a kernel module fails, modules are separated from the kernel but can not be loaded dynamically. Windows has a microkernel

### Hybrid
Has monolithic and microkernel practices. Windows server uses this approach, windows server is very stable

### Exokernel
Is similar to adding a layer to the OS so it can do some specific task. Maybe similar to openstack to do cloud, proxmox. Its an OS architecture that gives applications direct access to hardware resources, a VMware virtual machine could be seen as an Exokernel

### Unikernel
Is like a module that lives in a kernel and lets you add functionalities, containers use them

### Nanokernel
They are used in containers 	

## Computer Boot Proccess

1. When it can't find anything in the memory the computer so it looks for another program called BIOS which is now 'replaced' with UEFI, which is basically firmware installed in the motherboard that CPU runs to start the booting sequence, you could acutally tell this program where you want to load the OS, it could be an USB, a CD, from network etc. By default Hard disk is where it loads the MBR from, is always at the beginning sector of the bootable device, after this some info that declares the OSs that live in the device, they are known as partitions. Then It will load the file system and then starts the bootloader and then it loads the kernel and the kernel loads all software that manages hardware, it means it starts some daemons/services, drivers, etc, so it ends up configuring the system across different levels of execution, and it then shows the command line or login screen, remember Linux can be loaded in memory from a USB as mentioned, also know that each partition will have its own kernel. There exists errors like kernel panic and segment violation which could also throw a kernel panic if it access some space in kernel that doesn't exists

## **Virtualization**
Is a hardware and software partitioning technique to create multiple execution environments. We can virtualize machines/hosts, applications, servers, networks, storage, vlans, etc. Statistically servers spend 80% of the time idle and 20% of time processing computations, that is why creating several execution environments in a computer is very important/convenient to reduce costs. The best scalability approach is combining both vertical and horizontal scalability. There is types of virtualization. OS virtualization like containers, hybrid and native virtualization.

### Types
* Full virtualization: Full simulation of hardware behavior over a VM
* Paravirtualization: Partial simulation of hardware behavior over a VM
* Operating System Virtualization: Virtualization based on a simple instance of the OS, containers use this
* Native or Hybrid: Full and paravirtualization, combining I/O(E/S) acceleration

### Hypervisor
Is the software or component in charge of creating virtual machines, its also known as Virtual Machine Monitor(VMM). There are some processors that support virtualization, so they will obviously perform better. There are different types of hypervisors, rings from 0 to 2 like VMware, ESXI, KVM, HyperV. Tip

### MicroVMs vs Containers vs Full VM
#### Full VM
They usually are more than 1GB. They contain the full OS so it contains the apps, system libraries, and kernel on top of another system which means a kernel on top of a kernel. We can not see processes in the VM from a monitor from the host

#### Containers
They don't contain the full OS, they just contain the apps and libs and they depend on the kernel of the host OS, this means for example if we are installing a Linux container we need to install it in Linux OS, it uses CGROUPS to be able to do segmentations of memory, they are literally like folders with binaries inside and CGROUPS assigns them memory and IP address, kernel has to have some flags activated or setup to be able to use CGROUPS. You can activate these flags in Linux search for the "firmware" folder inside it it should have the "cmdline.txt" file and edit it with something like nano, `cgroup_enable=cpuset cgroup_memory=1 cgropu_enable=memory`. We can see container processes from host, they are faster, smaller but is dangerous to kill a process from the host. The virtualization it uses is of "operating system virtualization" type 

##### commands
* `ssh developer@192.168.0.9`: I think this code lets us use ssh to connect to a remote computer
* `nmap -sn 192.168.0.0-30`: network scanner used to discover hosts and services on a computer network by sending packets and analyzing responses.
* nano <file_path>: opens editor, if path is not an editor will show a list of files
* `sudo rm -R <file_path>: removes a file recursively, meaning it deletes everything inside the folder of the path
* `<any_command> man`: this will give you all options possible to add to a command you in a similar way `help` or `-h` gives you info
* `echo "hola" > hola.txt`: crea un archivo y le escribe el texto
* `systemctl <action> <program>`: action can be "status", "start", "stop", "restart"
* `/etc/init.d/<program> start`: old way to start a program
* `ps -aux`: displays processes * 
* `vi <file_name>`: creates a file and opens it in visual editor but nano may be better for new users
* `wget <url>`: lets download files from internet
* `ps -aux`: Lists all processes and its info
* `kill <PID>>`: Kills a process being executed
* `kill -a <PID>`: Force to kill a process
* `killall <name>`: Force to kill process by name
* `top` and `htop`: Monitors processes in real time

#### MicroVm
It has almost all OS inside it but it has an agent that makes it load lightly and fast without unnecessary tools/programs/libs, so it will execute like a Full VM and not a container. Its size is similar to a container but behaves like a full VM. VM processes are not visible from the host, so it can be used when we want to encapsulate those process and want to secure them that way. AWS lambda runs on a microVM. 

# Class 5
[Docker architecture, Docker vs Virtualization(Hyperisors)](https://medium.com/@syedalioffcl/docker-deep-dive-8cbf0a06a452)

## GCP with Docker

1. Create a Google Cloud account, we will be creating a VM

2. First create a rule for the firewall, on top left open the service list and go to "VPC Network" go to "Firewall" and click "Create Firewall Rule", we will create two rules, "allin" and "allout". All in, enter name a tag name, in "Source IPV4 ranges" put "0.0.0.0/0", this means "any where" and in "Protocols and ports" select "Allow all" and then click "create". All out has same configurations as all in.

3. Create a VM, select in the service list "Compute Engine" and "VM Instances", "Create Instance", in "Machine Configuration" window give it a name, select the image you want to use, you could use "N1". In "OS and storage" window click "change" and in "Operating system" select "Ubuntu 24.04 LTS". In "Networking" window apply rules we created using the tags you entered, for this example no other configurations are needed so just click "CREATE" at the bottom

4. You'll see the VM in the "VM instances" window on the left rail. We need to log in to the instance. In the instance list your VM has an option under "Connect" column, it should be set to "SSH" select the arrow in that setting and go to "View google cloud command" and copy the command, open your computers terminal and paste the command, we will use SSH protocol to connect to our VM remotely. To be able to connect  more easily you should install "gcloud cli" on your computer, check the official documentation. The other alternative is from the window we copied the command, we can launch a cloud shell by clicking "RUN IN CLOUD SHELL" and drag the terminal from the bottom. Just paste the command in either interface, locally or in cloud shell. When installed locally you launch it by using `gcloud auth login`

5. Now follow [this repo](https://github.com/sergioarmgpl/taller-docker) instructions, I'm in a WSL context and already have installed Docker desktop for windows, In the Lab notes in class 1 and class 2 you can find instructions on how to set it up. Do "Taller 1" first. You Could use "killerCoda" to get an Ubuntu machine to do this workshop instead of using wsl

6. If build container fails try searching in the docker config do `nano $HOME/.docker/config.json

7. We can upload our image to dockerhub, for that you need a dockerhub account and do a `docker login -u <ducker__hub_user_name>` and then `docker push <container_name>`

## Notes

* Whenever we  need Docker to run a program for example nginx and we don't know the command we can search on google something like this "nginx command to run container"

## Cloud Computing
Computing services and resources that are accessible through the web, configured programmatically and accessed through a paid or free payment model or paid by a infrastructure provider

### Could Computing Services
#### Types
* SaaS: End user app like: Wordpress, .js applications, .jar, etc
* PaaS: Applications servers or runtimes like: NodeJs, Apache, Glassfish, Net Core
* IaaS: Is basically an operating system running on top of hardware(Bare metal), so it basically is created from these two components, hardware and an OS. Examples: GNU/Linux, Ubuntu, Fedora,

#### Cloud Types by Access To Its Resources
* Public: anyone can access through internet
* Private: Accessed locally where cloud 
* Hybrid: Public and private
* Community: Shared resources between clouds to accomplish a goal, like investigating a subject.

An example of different clouds is: In a university students data lives in a private cloud, it can only be accessed from within but the students can log to a users so it means they talk to a public server in a public cloud, this creates a hybrid cloud and lets say the university is working with another university  that could use same resources, meaning their service would be using the first university resources, and that would be a community could.

#### Software
Software like OpenStack, VMWare ESXI and Open Nebula and many more are used for creating clouds.

# Class 6(12/10/24)

## Containers Advantages

* No need of special hardware
* Apps are executed with same speed as physical machine
* Ver portable, fast to move
* Developers and Operators are closer
* Easier scalability 

## Docker Architecture
It has a lot of components but two important to talk about

* RunC: in charge of creating containers. In charge of manage and execute at a lower level it uses "libcontainer" library
* ContainerD: uses RunC but they are at the same layer. Is a daemon which manages containers lifecycle. Kubernetes only uses ContainerD when managing Docker containers

### OCI: Image Storing Standard
It is now being used to store all types of info not containers only, OCI type artifacts 

## Cloud Native
Examples of cloud native implementations are:  containers, services networks(mallas de servicios), microservices, inmutable infrastruture, declarative APIs

Devpos, containers, microservices, versioning. Web factor apps is key concepts that explains the purpose of cloud computing. Cloud native works with concepts of CI/CD, DevOps, microservices, containers.

So cloud computing is the action of leveraging of building software apps using containers, service networks, microservices and  immutable infrastructure APIs

### Monolitic Architecture
Basically MVC

## CNCF
they have different levels of opensource proyects, they are separated in four levels, sandbox, incubated, graduated and archived. sandox is less mature and archived is the most mature. They are accepted and supervised byt TOC which is a committee. TAG are groups that investigate and they are supperted by working groups

To join CNCF go to their slack channel, join "cloud native community group", create events, assist to events and contribute

## Keppler
Is a software that lets track energetic Kubgernetes comsumption. Other tools that helps track and leverage resources efficiently is registry softwares like Harbor. Most used container registries  are administrated by the cloud providers or docker

## Container Registry
Is basically a private repo or central hub where the building blocks of the containerized applications live. It enables to share and access containers images effortlessly. Docker hub is a public container registry. They are used to store proprietary or sensitive container images. Amazon Elastic Container Registry, Google Container Registry, Azure Container Registry are private registries

### Harbor Example
note: kubevirt provides virtualization API for Kubernetes, run and manage virtual machines and containers on same platform

1. Create a VM in GCP, in this example we used a static IP

2. Connect to it in a local machine using SSH

3. Go to Harbor's documentation, find the ".tgz" file right click and get the link copy it and run in your terminal that is connected remotely `wget <url>` once downloaded, unzip it with `tar -xzvf <file_path>` -x means extract, -v means verbose meaning you will se logs, -f tells an specific file name you want to extract, at least you need to do a `-xf <file_name>`, `-z` and/or `-v` are optional

4. **To avoid running docker with sudo all the time search on google "docker post install"**, you will find command `sudo groupadd docker`, `sudo usermod -aG docker $USER`. cd to new folder and keep following harbor's installation instructions, got to "configure the Harbor YML file", find it in the folders go to "run installer script" section. Run `sudo ./install.sh`. 

5. Random note: Some people use an ingress like nginx when in their stack when working with Kubernetes however they are difficult to configure and have other disadvantages so API gateway is an alternative that some have used. When you run the installer script if you haven't set up anything else you'll see a message asking for the hostname that the registry service and the admin UI lives in. So in this example the teacher had a domain in digital ocean so on the landing dashboard he enters the domain he bought and copied the IP address of the VM that was created in GCP which is the "External IP" field, paste it in the "will direct to" field in digital ocean and assigns a host name also and in "TTL" 1800 is entered. Just for you to know this DNS/domain lives inside a project that he created in digital ocean. This can be tested with a ping to this DNS, after its successful write in in the .yml file. Save the file and exit

6. Install an HTTPS certificate. Go to "letsencrypt.org" in the get started option and look the instructions that says "Certbot"(We found it under "With Shel Access"). Create it, select your website is running "Other" on "Linux(snap)", follow the instructions bellow, in this case we where given the command `sudo snap install --classic certbot`, all this is done on the VM in GCP. Next command in instructions `sudo ln -s /snap/bin/certbot /usr/bin/certbot` and finally `sudo certbot certonly --standalone -d <domain>` this stand alone option means it is not using a web server, instead the VM itself validates the certificate

7. You will have two certificates, a private and a public cert so go and edit the .yml file that contains the Harbor's configurations and paste the public cert URI in "certificate" and in the private one in the "private_key", now just set up user and password.

8. Install Docker compose you can search for it `apt-cache search docker-compose`, install it `sudo apt-get install docker-compose -y`

9. Run the build command again `sudo ./install.sh`

10. You should be set up by now, just type the domain name in the browser, you'll see Harbor's UI and log in.

11. Create a project, quota limits will be "-1". create a user and add a member as an admin

12. `docker logout` to log out of docker-hub and do `docker login <registry_domain> -u <user>`, enter your password. This is done in a terminal that is not connected to your GCP server

13. Now you can push images to your registry. To check commands to do it go to the "Repositories" tab and look for "PUSH COMMAND" section and look what you need, in our case we did the 'tag an image for this project'. Tag the local image of your choice, check `docker image` to make sure it is good

14. Push your image `docker push <harbor's_server_domain>`, your image is now in your private registry.

15. You can download this private image from anywhere as long as you have the domain of the host, user name and address, from any computer do the same login `docker login <registry_domain> -u <user>`, enter password, and do `docker pull <domain>/<project_name/<image_tag>`

16. For fun lets replicate our docker-hub registry to this private one. In Harbor go to "Registries", click "New Endpoint", enter the info required and create a "replication rule", you might need to select "pull based" in your rule


# Class 7(11/12/24)
Non-functional attributes, system attributes

## Golden Metrics
Latency, Traffic, Errors, Saturation. 

In class we made and example of configuring Grafana with MySQL using docker compose. The goal was to load info to MySQL db and generate plots with grafana

1. Generate a docker compose file using copilot, prompt was similar to: "generate a docker-compose.yml file to run graphana and MySQL on my local computer". Build the compose file and go to localhost:3000, that is where Grafana is listening

2. get the info, use `ps -aux` to see resource usage by process and do `ps -ax | awk '{print $1,$4} | tail -5' this will print last 5 processes number and the command it is executing

# Class 8(12/12/24)
We saw a little harbor and oras at first

## Processes
In SO GNU/Linux we can find the processes info in "/proc", a directory is created for each process ID, so basically a list of processes ID. A host can monitor/see a guest processes info. You can enter a process directory and check more file with the process info there, like "statm" which is the memory used by the process

Commands to manage processes in GNU/Linux due to kernel's monolithic nature: 
* `ps -aux`: Lists all processes and its info
* `kill <PID>>`: Kills a process being executed
* `kill -a <PID>`: Force to kill a process
* `killall <name>`: Force to kill process by name
* `top` and `htop`: Monitors processes in real time

There is three concepts we need to know when talking about processes:

* Process: Is a program in execution. It has Heap, Stack, Data, Text, etc
* Task: Is creation of the process resources, the process in memory
* Thread: Is the unit of a process execution. Process resources are divided between threads, each one has its own part or the Heap, Stack, Data, Text, etc. So this means they are a segmentation of the process within itself to perform actions parallelly

When a process is finalized the process structure should be removed from memory, but sometimes this could fail for some reason and it is called "zombie process", is dead in memory but alive in stack

### Process States
* New
* Ready
* Running / Waiting(when needs to interact with hardware like I/O)
* Finalized

## Scheduler
Is a program that assigns processes to a CPU. There is different types and disciplines.

### Types
* Long-term: Puts process with ready state to memory
* Medium-term: Manages which Process in RAM are passed to virtual memory
* Short-term: Manages process in ready state and puts them in running state to be executed in CPU

### Disciplines
* FIFO
* Shortest remaining time, manages processes by the time their are going to spend in execution
* Fixed priority pre-emptive, manages processes by their priority
* Round Robin(circle of processes), processes take similar turns to execute.
* Multilevel queue, groups processes by different tags like user, administrator processes and executes them based on their group/tag 

## Process Control Block(PCB)
The structure that manages process in C is called PCB, is used to manage their lifecycle by the scheduler, their structure/properties are:

* Proccess ID
* Name
* Priority
* State

# Class 10 (13/12/24)

## Parallelism and Concurrency

### Monoprogramming(sequential)
Just one program executes in a process at a time

### Multiprogramming(Paralel/Asynchronous)
Programs alternates execution over the same process, it looks like they being executed separately however they are in the same process acutally. Asynchronous programming is more like a model, it is used to achieve concurrency. Asynchronous model describes that a process can execute other tasks/computations while a long running task is running in the background(like reading/writing a file or a DB) and when it is completed continue executing the next tasks, so basically asynchronous programming is used to achive concurrency

### Concurrency
Several programs exists at the same time but only one is executed, most of the times means there is only one CPU

#### Inheritably and Potential Concurrency
Inheritably when they are forcibly executing actions simultaneously due to the nature of its environment, cashiers. Doesn't need to  be concurrent but it will benefit the system to speed up execution.

### Parallelism
Exists more than one CPU so more than one program is executed at the same time. Is a particular case of concurrency, basically two or more concurrency executions are happening. Multiprocessors are needed to use parallelism. Basically is a way to achieve concurrency

### Concurrency vs Asynchrony vs Parallelism
To achieve concurrency we only need one or more computational resources, if there is only one computational resources we need to execute tasks asynchronously to achieve concurrency. If we two or more computational resources we can either execute tasks in parallel to achieve concurrency and/or combine parallelism and asynchronous execution to achieve greater concurrency

The scheduler is in charge of deciding what and how processes will be executed on CPU

* Note: you can use `wget` to download files from CLI

### IPC(Inter Process Communication)

#### Mutual Exclusion
Is an access and computers resource use synchronization strategy. Talking in programmatical terms there is something called "critical region", it exists in between the process start and end which access a resource function. and the critical region lets us implement implement an access resource mechanism

### Interbloqueo(Deadlock)
Happens when process a is talking to process b and process c is talking to d, if b fails some executions behing, or accros this process will be blocked. It happens due to the mutual exclusion implementation. It happens if all the following are true

- Mutual exclusion: A process access a resource
- Retention or contention and wait: Process obtains resouces
- Unpropretivity: Asking for more resources but it already has all resurces
- Circular waiting: All processes are waiting for the next process to free its resources

If any of the above are false tbe it could be that a very odd situation is happening, called indefinite postergation which means the resources could be free up sometime later

# Class 11 (16/12/24)
Teacher was not recording the class so I couldn't know what he talked about first.

It is possible through google's cloud service called GKE. Is under the "Kubernetes engine" and "Clusters". Remember to apply an all in all out firewall rule. If you want to run it from your local machine first install google cloud SDK and then install "kubectl", kubectl credentials are in Clusters>MyCLuster>Details>Show Cluster Certificate

Kubernetes was called "Borg" and it was a Google's project and now is open source

## Cluster Nodes
* Master Node, this node has to have Kubernetes installed: etcd(db thats stores the cluster configs), kube-api(is the api), kube-controller manager(creates some component on cloud is like a balancer for Kubernetes), kube-scheduler(in charge to manage which container runs in which VM), kubectl(in charge to interpret commands in command line), kubelet, core-dns, network-driver

* Worker Nodes: kubelet, kube, kube-proxy. Kube and kube-proxy has a runtime which is based on OCI they talk to the API in master

* Client: kubectl

`container clusters create k8s-demo --num-nodes=1 --tags=allin,allout --machine type=n1-standard-1 --no-enable-network-policy`: creates a cluster in gcloud this is posible with the Google's SDK if you're logged in to your account

## Create a Cluster
It will contain an Nginx POD, Nginx is a web server, load balancer, etc. Be aware that the port-forward command is similar to a load balancer but it jus

1. `kubectl run mipod --image=nginx --restart=Never`
2. `kubectl get pods`: tell the pods that exists
3. `kubectl port-forward pod/mipod 8080:80`: Redirects POD(running inside a cluster) port 80 to local host 8080
4. `kubectl delete pods mipod`: try it before running this command since it deletes the POD

## Cluster Custom(V2)
1. `kubectl run mipod --inmage=nginx --restart=Never`
2. `kubectl get pods`: tell the pods that exists
3. `kubectl expose pod/mipod --target-port=80 --port=80 --type=LoadBalancer --name=mipod-svc`: Creates a load balancer service, a loadbalancer is a component with a public IP and services will redirect its traffic to it so the client can access to services only through it. It can take UDP or TCP. It has an extra cost in gcp but the IP will never change. The service/pod we created is now going to be access through a load balancer
4. `kubectl get services mipod-svc` o `kubectl get services`: shows IP and more
5. `kubectl get pods -o wide`
6. `kubectl get nodes -o wide`
7. `kubectl delete pods mipod` or `kubectl delete services mipod-svc`
8. `kubectl describe nodes NODE_NAME | grep ExternalIP`

## Cluster Custom(V3)
1. `kubectl run mipod --image=nginx --restart=Never`
2. `kubectl get pods`
3. `kubectl expose pod/mipod --target-port=80 --port=80 --type=NodePort --name=mipod-svc`: syntax to expose port usng the node port which is similar to a port-forward, using node port is not convenient because if the pod dies a new will be created and therefore the IP will change so that is why a load balancer works, just for temporary use or if using an on premise setup, if no type declared default is "ClusterIp". ClusterIp creates an internal DNS name so you can ping or connect using the service name
4. `kubectl get service`
5. `kubectl get pods -o wide`
6. `kubectl get nodes -o wide`: shows IP and more
7. `kubectl describe nodes <node_name> | grep  ExternalIP`

Just to test the default clusterIP service just do step 1 to 3. In step 1 change image to "alpine/curl". So this pod will have an instance of this image that has the curl program installed. We will try to connect to the service `mipod-svc` from this other pod we are creating below

1. `kubectl run -it curl --rm --image=alpine/curl \ --curl http://mipod-svc --restart=Never -- curl http://mipod-svc`: the `--` at the end indicates a command we can execute we could access the pod using `/bin/[bash/sh]` but since we have the curl program in this image we will run it using the mipod 3alias to connect to the other pod, just like in docker when we connect to another container inside the same docker network, either the default or a custom one, we can use the container name to connect to it without using its IP address specifically.
2. `kubectl get pods -n kube-system`: you can see the DNS registry there, called "kube-dns" it is in charge to manage the inner network DNS names

Try it, on your browser enter http://127.0.0.1:8080 . Like in Docker you have to declare an entry point in some cases in this image the Nginx server already has the entry point defined and that entry point will start the server.

# Kubernetes Objects
## POD
A POD is like a container but it can have several containers inside. It is the smallest 'unit', to update a pod you have to delete it and build it again but if you use a deployment component, which contains pods by using another component, that lives inside the deployment, this replica set will be in charge to create the pods, you will be able to . Pods have one or more containers inside.

PODs memory is not persistent and that is why we need use a component called "persistent volume claim" which is actually like a disk partition from something called "persistent volume" which is like the main hard drive, it uses the storage drivers called "storage class"

## Commands that work with all objects
* `kubectl get <object_name_in_plural>`
* `kubectl get <object_name_in_plural> <object>`
* `kubectl delete <object_name_in_plural> <object>`
* `kubectl describe <object_name_in_plural> <object>`
* `KUBE_EDITOR=nano kuebctl edit <object_name_in_plural> <object>`: changes the text editor Kubernetes use by default which VIm
* `kubectl get <object_name_in_plural> <object> -o yaml > <object>.yaml`: produces a yaml with the script to produce it
* `kubectl create -f <object>.yaml`
* `kubectl delete -f <object>.yaml`
* `kubectl apply -f <object>.yaml`: This updates the Kubernetes object declared in the yaml ile, be aware that if you changed a yaml file that contains some POD and it has changed you first have to delete it, and if you are running it for a deployment or a service you might not need to delete it at least this is true for the deployment objects

You can run this commands but you also have the option of using scripts in yaml files

## POD commands
### Create and update
* `kubectl run <podName> --image=<image_name> --restart=Never`
* `kubectl run <podName> --image=<image_name> --restart=Never \ --dry-run -o yaml > podx.yaml`: runs some sort of simulation, a simulation of creating a pod and stores the configurations in the yaml. if we remove `> podx.yaml` it wont create the file but only print configurations on the screen
* `kubectl create -f podx.yaml`: creates a pod based on the yaml file
* `kubectl apply -f podx.yaml`: same as create but if already exists it will force the creation

After we execute the run command we can now expose the pod.

* `kubectl expose <pod_object_type(in this case "pod")/<object_name> --target-port=80 --port=80 --type=ClusterIP --dry-run -o yaml`

This command will create a yaml file with the POD configurations without actually creating the POD, we can run it again to generate a service, to do that once the first file is created use a text editor to add `---` and then run it but this time using double greater than sign `>>`, `>` means create and `>>` means append. If we run this we now will add a service configuration to the script. We can build the script locally with the 	`apply` command and passing the yaml name, then we can check the services created with `kubectl get svc`. This types of scripts can then be read inside a CI/CD pipeline by storing this file in a GitHub repo and the pipeline will be reading this configuration file to deploy them, the tools that are used to do that are "Argo CD" and "Flux", Flux may be the most famous. 

### Delete pods
* `kubectl delete -f podx.yaml`
* `kubectl delete pods <pod_name>`

### Get all pods in default namespace
* `kubectl get pods`

### Show more information
* `kubectl get pods -o wide`: We can get pods internal info, like internal IP 

## POD file parts
pod hast to have 4 parts: apiVersion(release name or tag), kind(object type), metadata(objects info, regularly contains name, namespace and labels), spec(configurations specific to the object). Each pod has a container inside it. It has a labels field but they are not too important in its declaration. example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: podx
  namespace: minamespace
  name: podx
spec:
  containers:
  - image: czdev/python-flask-distroless
    name: podx
```

## Commands to work faster
* `--dry-run`: to simulate an execution without building actually storing the generating object
* `-o yaml > <name>.yaml`: puts the configurations into a YAML file
* `--dry-run -o yaml > archivo.yaml`: combine these last two

## Namespace
You can think of namespace as folder, you would create these 'folder' in which you can create all objects inside a POD inside this 'folder' this will create some sort of sandbox or environment for the objects inside it. They can be added to an objects metadata in the YAML file with the `namespace: <namespace_name>`.Their YAML file looks like:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  creationTimestamp: null
  name: minamespace
spec: {}
status: {}
```
### Namespace Commands
* `kubectl create namespace <name>`: the default namespace is called "default", if we don't create one this one is created along with other two, "kube-public", everything here can be accessed from any namespace and "kube-system", this one is specific to the cluster's components
* `kubectl get ns`: 
* `kubectl delete ns <namespace_name>`
* `kubectl apply -f <namespace_name>`: create the namespace
* `kubectl run <pod_name> --image=<image_name> --restart=Never -n <namespace_name>`: Creates a pods within an specific namespace
* `kubectl get pods -n <namespace_name>`: gets pods in the specified namespace
* remember we can add the `-o yaml` and/or `--dry-run` to produce a yaml file and/or spinning up a namespace without actually creating one

# Class 12(17/12/24)

# Kubernetes Objects

## Deployments
They helps us escalate our projects using replicas like we can see in the Kubernetes architecture image, these replicas can create other PODs instances to escalate the app to be high available and also can make roll backs.

### Deployments Commands
* `kubectl create deployment <deployment_name(usually an app name)> --replicas=<number> --image=<image_name>`
* `kubectl get deployments` or `kubectl get deployments <deploy_name> -o yaml`: the later will print the yaml file of the specified deploy
* `kubectl describe deployment <deploy_name>`
* `kubectl edit deployment <deploy_name>`
* `kubectl delete deployment <deploy_name>`
* `kubectl scale --replicas=<number> deployment/<deploy_name>`
* `kubectl apply -f <name>.yaml`: forces creation of the deployment described in the YAML file
* Again remember we can use the `-o yaml > <name>.yaml` and/or `--dry-run`

### Using Rollouts Rollback Example
Search "Deployment Rollout in Kubernetes" on the internet. The Kubernetes rollout annotation description is done with `Kubernetes.io/change-cause` tag under `annotations` tag under `metadata` tag. Kubernetes roll outs are a very powerful feature, we can change versions and even contianers very easily. It is very common to put the hash of a commit here, this file is basically what you need when doing CI/CD

this is a deployment file, look the change-cause tag: 

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels
    app: nginx
  name: nginx
  annotations:
    # This is done because the name of the image change, version changed
    # it writes to a log to keep record of changes
    Kubernetes.io/change-cause: "version to 1.26.2"
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.26.2
        name: nginx
        resources: {}
status:  {}
```

we could change the containers image version just for example in this case from `nginx:1.26.2` to `nginx:1.27.8`, then run `kubectl deploy -f <deployYAMLfileName>.yaml` if already an object was created previously with a `kubectl create` command, and then we again do another upgrade of the version and leave a `change-cause` and Kubernetes will keep track of these tags and the configurations, we can see them with `kubectl rollout history deploy <deploy_name>` and move to an specific rollout using `kubectl rollout undo deployment/<deploy_name> --to-revision=<revision_number>`, print yaml `kubectl get deployments <name> -o yaml` or the history command again to see the versions change

`httpd` is apache web server in docker hub

We can have more than one ".yaml" file in a folder. When K8 creates a deployment it create a replica set that controls the pods replicas quantity. The name of the pods have a part of the name of the replica set plus something added to it, we will see this if calling the `kubectl get pods` commands, the pods created by the replica set will have that naming conventions

### Deployments Commands 
`kubectl scale --replicas=<quantity> --image=<image_name>`
`kubectl scale --replicas=<quantity> <deployment|deploy(shorthand)>/<deploy_name>`
`kubectl get deployments`
`kubectl describe deployment <deploy_name>`
`kubectl edit deployments <deploy_name>`
`kubectl delete deployments <deploy_name>`
`kubectl apply -f <name>.yaml`

pod hast to have 4 parts: apiVersion, kind, metadata, spec. Each pod has a container inside it. It has a labels field but they are not too important in its declaration. example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: podx
  namespace: minamespace
  name: podx
spec:
  containers:
  - image: czdev/python-flask-distroless
    name: podx
```

build it with: `kubectl apply -f podx.yaml`

A deployment has 4 sections, apiVersion, kind, metadata, spec. Here the labels are ver important.Example:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels
    app: app1
  name: app1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app1
  strategy: {}
  template:
    metadata:
      labels:
        app: app1
    spec:
      containers:
      - image: nginx
        name: nginx	
```

the spec inside spec section has to be the same as in our pod file, this way Kubernetes knows what pods is going to use if it doesn't match it will cause a service to not recognize a pod if it matches it can be directed to a very complex service. In command line we can generate the "yaml" file this way we can be sure it is configure correctly. Build the generated yaml with:

Build it with `kubectl apply -f app1.yaml`

## Troubleshooting pods commands
Be aware Kubernetes creates a default namespace, when the cluster is created in the default namespace this argument can be removed

* `kubectl run -it client --rm --image=busybox \ --restart=Never -n <namespace_name> -- sh`: creates a temporary small POD which can help debug, busybox is small build. It is removed on exit due to `-rm` flag
* `kubecl run -it curl --rm--image=alpine/curl \ --restart=Never --curl http://<a sevice address, it can be a pod ip address, a hostname, inclue por or not>`: if you connect to a POD within your network for example apache web serer you will get some response
* `kubectl exec -it <pod_name> -n <namespace_name> -- [bash|sh]`: helps access inside pod CLI
* `kubectl exec -it <pod_name> -c <namespace_name> -- [bash|sh]`: helps access inside pod CLI
* `kubectl describe pods <pod_name> -n <namespace_name>`: gives info about the pod

### Note
Oras is a tool that helps us create artifacts using the OCI protocol which is the same protocol used to create container. Using it we could wrap an LLM inside and OCI artifact so we could have a container download this artifact which would be an alternative of using a CDN, we could wrap a web server, basically anything. For example we could set a website to download the OCI artifact on start

### Wrapping a Web Server(Nginx) inside an OCI and deploy it using a Kubernetes Deployment Object Example
We used a deployment object because we need to restart the POD

* `kubectl create deployment nginx-oci --image=nginx --dry-run -o yaml > nginx-oci.yaml`: creates the deployment object and generates yaml file. If you see inside the yaml file you will see it contains replica set which contains a container that is using an "nginx" image, this is the first container. We need to set up an init container, you can go to Kubernetes docs to see how to create one. Bascially it is a tag with three child tags that will be declared inside the yaml file we just generated and that has to be declared at the same level as the first container

nginx-oci.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp:null
  labels:
    app: nginx-oci
  name: nginx-oci
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-oci
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx-oci
    spec:
      initContainers:
      - name: init-index-page
        image: busybox:1.28
        command: ['sh', '-c', "echo 'hola'> /var/www/html/index.html"]
      containers:
      - image: nginx
        name: nginx
        resources: {}
status: {}
```

The init container will run the command that replaces the original nginx index.html file, again, the greater than sign is . They have access to the same memory disk space so we can edit this file.

* `kubectl describe pods nginx-oci`
* `kubeclt apply -f nginx-oci.yaml`: creates the deployment
* `kubectl port-forward deploy/nginx-oci 1234:80`: this command gave error "cant forward port because pod is not running", go next step
* `kubectl get pods`: use it to debug, we get the name of the pod
* `kubectl describe pods <name_of_pod>`: good start it gives us event info and some status but not enough info so is a good start
* `kubectl logs pod/nginx-asfai8wef-asdfa(this is how the name would look like)`: log said "default container ""nginx" is waiting to start: podInitializing"
* this time add the default container name to the command `kubectl logs pod/nginx-asfai8wef-asdfa nginx`: gives us same info
* Looking back to info in the `describe` command we see that the container called "init-index-page" is also inside, we know this also by the script, so include it in the command `kubectl logs pod/nginx-adkfall-k9asj init-index-page`: now we got more useful info "sh: can't create /var/www/html/index.html: non existing directory", this is because we though the volume(hard digital disk) was being created and shared by default but is not the case, so go to documentation and search "persistent volume" enter the documentation you should find some script with a volumes tag that contains name, hostpath which contains path, iniside it. we will see how we add it below

By adding the shared volume both containers/pods in this deployment object will have access to the same file system

nginx-oci.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp:null
  labels:
    app: nginx-oci
  name: nginx-oci
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-oci
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx-oci
    spec:
      volumes:
      - name: vol
        hostPath:
          path: /test
      initContainers:
      - name: init-index-page
        image: busybox:1.28
        command: ['sh', '-c', "echo 'hola'> /var/www/html/index.html"]
      containers:
      - image: nginx
        name: nginx
        resources: {}
status: {}
```

now force the creation of the object, but first 

* delete it `kubectl delete -f nginx-oci.yaml`, 
* create it `kubectl apply -f nginx-oci.yaml`, the folder "/test" will be created inside the host, 
* check logs again `kubectl logs pod/nginx-oci-aksdfjka-asdfa nginx`: error again
* check logs again `kubectl logs pod/nginx-oci-aksdfjka-asdfa init-index-page`: same error again
* go back to documentation and find under "persisten volumes" docu, we're going to mount the volume, find the `volumeMounts` tag copy the children tags the yaml file looks like following

nginx-oci.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp:null
  labels:
    app: nginx-oci
  name: nginx-oci
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-oci
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx-oci
    spec:
      volumes:
      - name: vol
        hostPath:
          path: /test
      initContainers:
      - name: init-index-page
        image: busybox:1.28
        command: ['sh', '-c', "echo 'hola'> /var/www/html/index.html"]
        volumeMounts:
        - name: vol
          mountPath: /var/www/html
      containers:
      - image: nginx
        name: nginx
        resources: {}
status: {}
```

This means the volume exists inside the server(I think it means the local host that is hosting the two containers) will create a "/test" folder in the local host, and inside the container inside the local host we are going mount it in the container with the `mountPath` indicated and then the command will create the file and then the file will be mounted to the nginx container. but after deleting the deployment to built it again, still not working, the error this time is best described in the info printed with the `describe` command, it says "failed to generate spec: fiale to mkdir "/test": read-only file system". this means in gcp for security we can not create a directory but we can try with an already created directory like "/tmp". This will work but in case it wouldn't had worked we would need to use a GCP data volume, delet it and apply, it will work

* `kubectl get pods`: shows the pods are running
* Now that it is working we are going to move the mount the volume with the same path in the nginx container, we will see if this is the right way in next step
* `kubectl get pods`: copy pod name
* Lets get in the pod `kubectl exec -it nginx-oci-la343k4-4m54m -- bash`, move to the folder we created `cd /var/www/html`, do `ls`, do `cat index.html`, it print the text we wanted, do `exit`
* expose the deployment with a port-forward `kubectl port-forward deploy/nginx-oci 6001:80`
* from another CLI do `curl http://127.0.0.1:6001`, it works but it doesn't give us the value we wanted
* Lets find out where the default page is actually pulled from, do `cd /etc`, `ls`, there is an nginx directory, `cd nginx`, `ls` see there are some "conf" and "conf.d" file, look into them with `cat`, `cat conf` doesn't has it, do `cd conf.d`, `ls`, print `cat default.conf` and there it says the root is "/usr/share/nginx/html;" so change that in the deploy yaml script
* delete the object `kubeclt delete -f nginx-oci.yaml`
* build it again `kubectl apply -f nginx-oci.yaml`
* expose it `kubectl port-forward deploy/nginx-oci 6001:80`
* test it `curl htttp://127.0.0.1:6001`

The yaml file looks like this now, only the spec section:

```yaml
spec:
      volumes:
      - name: vol
        hostPath:
          path: /test
      initContainers:
      - name: init-index-page
        image: busybox:1.28
        command: ['sh', '-c', "echo 'hola'> /usr/share/nginx/html/index.html"]
        volumeMounts:
        - name: vol
          mountPath: /usr/share/nginx/html
      containers:
      - image: nginx
        name: nginx
        volumeMounts:
        - name: vol
          mountPath: /usr/share/nginx/html
        resources: {}

```

Now, using harbor(this was set up in class6), we are going to make the init contatiner(the busybox container) download the index file from this private registry created with harbor, it could have been an LLM

* first we need to create the OCI using "Oras", look at get started docu, how to guides, "pushing and pulling", basically log in to oras, `oras login -u admin -p Harbor23 <host_name>`, do the push you might do a `oras push --help`
* now instead of using busybox we are going to use a container that has oras, go to docker hub, in our example "bitname/oras" image was used
* from the container docu we see a similar command to the following would have to be ran `docker run --name oras bitnami/oras bitnami/oras:latest oras pull <oras_host_name>`
* Using the `--help` flag we came to this docker command, docker should be running in the background, `docker run -it --rm --name oras bitamani/oras:latest pull <oras_host_name>/<oras_project_name/<oras_archetype_name>:<version>`, you might get permission denied, but this is some other problem, you have the right command now
* Doing a `pull --help` we see that when doing a pull using oras we can also specify an out put directoy with `-o <path>` flag
* We need to modify our deployment to use this container and run the oras command 

```yaml
spec:
      volumes:
      - name: vol
        hostPath:
          path: /tmp
      initContainers:
      - name: init-index-page
        image: bitnami/oras:latest
        command: ['docker run -it --rm --name oras bitamani/oras:latest pull <oras_host_name>/<oras_project_name/<oras_archetype_name>:<version> -o /usr/share/nginx/html']
        volumeMounts:
        - name: vol
          mountPath: /usr/share/nginx/html
      containers:
      - image: nginx
        name: nginx
        volumeMounts:
        - name: vol
          mountPath: /usr/share/nginx/html
        resources: {}
```

The command in the oras init container is downloading an artifact that contains a text file

* build object `kubectl apply -f nginx-oci.yaml`
* `kubectl get pods`: the pod was created but it is not running, copy pod name
* `kubectl describe pod/<pod_name>`: no info is give
* `kubectl get pods <pod_name>`: error says "no such file or directory: unknown", lets try adding the file name also

```yaml
spec:
      volumes:
      - name: vol
        hostPath:
          path: /tmp
      initContainers:
      - name: init-index-page
        image: bitnami/oras:latest
        command: ['docker run -it --rm --name oras bitamani/oras:latest pull <oras_host_name>/<oras_project_name/<oras_archetype_name>:<version> -o /usr/share/nginx/html/index.html']
        volumeMounts:
        - name: vol
          mountPath: /usr/share/nginx/html
      containers:
      - image: nginx
        name: nginx
        volumeMounts:
        - name: vol
          mountPath: /usr/share/nginx/html
        resources: {}
```

* `kubectl delete -f nginx-oci.yaml`
* `kubectl apply -f nginx-oci.yaml`
* `kubectl get pods`: copy pod name
* `kubectl describe pods <pod_name>`: the folder doesn't exists, the example was not finished in this class but the possible problem is that the container doesn't have any directories and some privileges may be needed to create the directory and file

## Kubernetes Operators
Is an object that makes a deployment, so we can just send parameters to the operator and the operator makes the deployment. "Operator Framework" and "Helm" are software that help us create these K8 operators, Helm makes installing packages very easily

# Class 13 (12/18/24)
## Services
To this commands we can add `-o yaml --dry-run` to get the yaml printed on CLI. Kubernetes can talk to another service but you have to move firewall and create rules to be able to do it. When you set up a service it generates the "yaml" serice yaml file and again the labels will match labels in deploy and/or files.

* `kubectl expose deployment <label_name> --port=<port> --target-port=<port> --type=ClusterIP`
* `kubectl expose deployment <label_name> --port=<port> --target-port=<port> --type=NodePort`
* `kubectl expose deployment <label_name> --port=<port> --target-port=<port> --type=LoadBalancer`: this load balancer has and static IP
* `kubectl get services <my_service_name> -o yaml > <name>.yaml` and `kubectl apply -f servic.yaml`: helps edit a service yaml file
* `kubectl expose deployment <label_name> --port=80 --target-port=80 --type=LoadBalancer`: Sets up a load balancer

examples:
* `kubectl expose deploy/nginx --port=80 --type=LoadBalancer --dry-run -o yaml >> deploy.yaml`: this puts the configurations of a service that 'controls access to a deployment which inside contains a pod that the deployment could manage using a replica set, and appends all these configurations to an existing file called "deploy.yaml"

### NodePort example
```yaml
apiVersion: apps/v1
kind: Service
metadata:
  labels
    run: mipod
  name: mipod-svc
spec:
  ports:
  - port: 5000
    protocol: TCP
    targetPort: 5000
    nodePort: 31111
  selector:
    run: mipod
  type: NodePort
```

### Load Balancer Example
```yaml
apiVersion: v1
kind: Service
metadata:
  labels
    run: mipod
  name: mipod-svc
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 5000
  selector:
    run: mipod
  type: LoadBalancer
```

build services with `kubectl apply -f <name>.yaml`

again it has four parts, apdVersion, kind, metadata and spec

## Example continuation
We are going to continue with the example but be aware that this example has a simpler version of what is actually used in real scenarios which is called a persistent volume, this volumes are actually a service the cloud provider offer its users, is a storage on the cloud, this is just a clarification.

* the Oras archetype which will contain just an html file with a phrase is already pushed to Harbor using the OCI tool Oras that turns the file into an OCI image
* create the deployment components `kubectl apply -f nginx-oci.yaml`
* check the pods are created and running `kubectl get pods`
* do a port forward
* do a curl to the local host and the port declared in the port forward command

So instead of storing this file in an storage service on the cloud like S3, we are using our private registry

* To be able to download the OCI artifact using an init container the teacher actually created a Docker image with the following configurations, be aware alpine does not have `curl` so here we're installing it:

```Dockerfile
# the file was base on Oras official documentation on how to install oras
# https://oras.land/docs/installation
FROM alpine
RUN apk add curl
ENV VERSION="1.2.1"
RUN curl -LO "https://github.com/oras-project/oras/releases/download/v${VERSION}/oras_${VERSION}_linux_amd64.tar
RUN mkdir -p oras-intall/
RUN tar -zxf oras_${VERSION}_*.tar.gz -C oras-intall/
RUN mv oras-install/oras /usr/local/bin/
RUN rm -rf oras_${VERSION}_*.tar.gz oras-install/
```

* build the image `docker build -t <user>/<name/tag> .`
* push image `docker push <user>/<name>`
* From the prev commands we can see that the deployment file will change, the image will not be the oras image we used in previous class

nginx-oci.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp:null
  labels:
    app: nginx-oci
  name: nginx-oci
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-oci
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx-oci
    spec:
      volumes:
      - name: vol
        hostPath:
          path: /tmp
      initContainers:
      - name: init-index-page
        image: <user>/<custom_oras_image_name>
        command: ['sh', '-C', 'oras pull <oras_host_name>/<oras_project_name/<oras_archetype_name>:<version> -o /usr/share/nginx/html']
        volumeMounts:
        - name: vol
          mountPath: /usr/share/nginx/html
      containers:
      - image: nginx
        name: nginx
        volumeMounts:
        - name: vol
          mountPath: /usr/share/nginx/html
        resources: {}
status: {}
```

### Create other deployments versions of the OCI example
This time we are going to modifiy the index.html file we are going to upload as the artifact. With this we intend to showcase how a blue-green deployment is done. we will also expose the deployment with a service and expose the service with a port-forward. Blue-green deployments are possible thanks to services

* `nano index.html`: inside it add some tag, maybe "v1", and do "v2" as well
* `oras login -u user -p password <harbor_host_name>`:  logging to ora
* `oras push <harbor_host_name>/<project_name>/<archetype_name>:<version> index.html`: push the file with the archetype name specified and version to v1 and v2, do both, one at a time so we will have three archetypes
* make sure the `metadata` children tags `labels:app` and name, the `spec` children tag `selector:matchLabels` and `template:metadata:labels:app` in the deployment yaml file is the correct one, they all have to match and we will change them. Lets do a version one and version two so you'll have to copy them and end up with three deployment yaml files "nginx-oci.yaml", "nginx-oci-v1.yaml" and "nginx-oci-v3.yaml".
* build all three deployments `kubectl apply -f nginx-oci.yaml f nginx-oci-v1.yaml f nginx-oci-v3.yaml`
* we can create a service that will expose the main deployment `kubectl expose deployment/nginx-oci --port=80 --target-port=80 --type=ClusterIP --dry-run -o yaml >> nginx-oci.yaml`
* check pods are running `kubectl get pods`, you should se three pods as well as three deploys `kubectl get deploy`
* we also create a port-forward now `kubectl port-forward deployment/nginx-oci 6001:80`

Now with all these three deployments we are going to do a "blue-green" deployment

* we can put the port-forward to the nginx service `kubectl port-forward svc/nginx-oci 6001:80`
* but we have a problem, when we do a curl to local host and port in the port-forward we get the wrong message in, we solve this by adding the `:latest` tag to the nginx image in the deployment yaml file of "nginx-oci.yaml"
* re run changes `kubectl apply -f nginx-oci.yaml`, check the last pod 	`kubectl get pods` we should see one is terminating but three are running
* do curl again and the message from the right archetype should be printed

Services not only lets us expose the pods/cluster as a load balancer but also it lets us a blue-green deployment. To do that in the 'main' deployment file, "nginx-oci.yaml". go to the service that exposes it the yaml file and change the `spec:selector:app` child tag, use the labels we specified in our deployments, and then everytime you change them:

* apply changes `kubectl apply -f nginx-oci.yaml`
* check they are running `kubectl get pods`p
* do a curl to confirm the correct message is loaded
* It will be working is not going to have the right behavior and that is because we are sharing the same volume across the different deployment objects we created. To solve this go back to each of the deployment yaml files and change the under under deployment object the children tag `spec:spec:volumes:hostpath:path` put a different path on each deployment, without this the something weird might happen
* repeat the process, apply, check the pods, and do a curl
* If you get any errors try deleting the service or the deployment(s), `kubectl delete svc nginx-oci` and build them again, remember you need to do a port-forward to expose the service that is exposing the deployment and lives inside its yaml file. The final yaml file is:

nginx-oci.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp:null
  labels:
    app: nginx-oci
  name: nginx-oci
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-oci
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx-oci
    spec:
      volumes:
      - name: vol
        hostPath:
          # this path changes in different deployments yamls
          path: /tmp
      initContainers:
      - name: init-index-page
        image: <user>/<custom_oras_image_name>
        command: ['sh', '-C', 'oras pull <oras_host_name>/<oras_project_name/<oras_archetype_name>:<version> -o /usr/share/nginx/html']
        volumeMounts:
        - name: vol
          mountPath: /usr/share/nginx/html
      containers:
      - image: nginx
        name: nginx
        volumeMounts:
        - name: vol
          mountPath: /usr/share/nginx/html
        resources: {}
status: {}
---
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels
    app: nginx-oci
  name: nginx-oci
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    # this has to match the label of the deployment we want to use
    app: nginx-oci
  type: ClusterIP
status
  loadBalancer: {}
```

## Troubleshooting & Monitoring Commands
* `kubectl logs -f pod/<pod_name>`
* `kubectl logs -f deployment/<deploy_name>`
* `kubectl describe deployments <deploy_name>`
* `kubectl run terminal --image=busybox --restart=Never --rm -it -n <namespace_name> -- sh`
* `kubectl run -it curl --rm --image=alpine/curl \ --restart=Never -- curl http://<>`: the last parameter is a command that will run on the command line of the container

# Class 14 (12/19/24)

## Helm
Helps us install packages, we can think of it as the Ubuntu's "apt" but in Kubernetes, we can used existing packags or we can build custom ones. 

### Install Helm
* curl -fsS -o get_helm.sh
https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
* chmod 700 get_helm.sh
* ./get_helm.sh
* helm repo add bitnami https://charts.bitnami.com/bitnami

Taken from [official docu](https://helm.sh/docs/intro/install)

## Helm + Nginx Ingress
We're  going to use an ingress controller to be able to use domain name. Ingress controller helps us set up a load balancer and assign it a domain name. This load balancer is shared because load balancers only allows traffic through port 80 and 443, only http and https traffic. Controller would be some sort of driver and Ingress uses this driver like component

## Commands to install Ingress Controller
* `kubectl create ns nginx-ingress`: create a namespace
* `helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`: similar to adding a source in apt
* `helm repo update`
* `helm install nginx-ingress ingress-nginx/ingress-nginx -n nginx-ingress`/`helm install <give_installation_a_name> <repo>/<file> -n <middle_component_installs_with_intallation_name_in_the_specified_name_space>`
* `helm list -n nginx`
* `helm uninstall nginx-ingress -n nginx-ingress`
* `kubectl get services -n nginx-ingress`
* `kubectl get ingressclass`: shows ingress controller info

[source](https://kubernetes.github.io/ingress-nginx/deploy/#using-helm)

## Example
We are going to add an endpoint/output to the service in the nginx-oci example that we have been working on. To do that we need to create an ingress definition. A lot of times when using an ingress controller we need to also do DNS configurations. An ingress controller is also similar to a gateway, here we are installing the nginx ingress controller, there are other companies that provide you with this component

* After we install ingress an example will be printed on the CLI, you can copy that to edit it
* Edit the yaml file of the deployment, `nginx-oci.yaml` and add the following at the bottom

```yaml
----
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  # ingress-nginx-oci
  name: mywebserver
  namespace: foo
spec:
  ingressClassName: nginx
  rules:
      # the "nip.io" lets you get a 'free' domain, like a simulation of DNS
    - host: 35.239.90.79.nip.io
      http:
        paths:
          - pathType: Prefix
            backend:
              service:
                name: nginx-oci
                port:
                  number: 80
            path: /
```

we have modified it little, result is:

----
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  # no namespace, it uses the default, this has to match the label in deployment 
  name: ingress-nginx-oci
spec:
  ingressClassName: nginx
  rules:
      # the "nip.io" lets you get a 'free' domain, like a simulation of DNS
    - host: 35.239.90.79.nip.io
      http:
        paths:
          - pathType: Prefix
            backend:
              service:
                name: nginx-oci
                port:
                  number: 80
            path: /
```

* This ingress controller creates a load balancer service, get the ip from it with `kubectl get svc -n nginx-ingress`
* Copy the IP in the `host` tag.
* Our example is in the default namespace so remove the `metadata:namespace` child tag and change the name in the same section `metadata:name: ingress-nginx-oci`
* apply the changes to the deployment run `kubectl apply -f nginx-oci.yaml` which is the 'main' deployment, this will create the controller
* If you would have a web domain you would just create the DNS registry pointing to the IP address you just copied, if not, this IP address is the url to access the API
* you can access the service now, you can use curl or a browser

Using linkerd we can alternate between deployment versions

Monitor logs using the following commands:
* `kubectl get pods`: copy the main pode name, it should be the first, that should be the first deployment
*  `kubectl logs deploy/nginx-oci -f <pod_name>

## Parallel Algorithms
Are a sequence of instructions that makes calculations, processes data, that are executed in different/several devices to finally combine/unite all the results in a consolidated correct result

### Parallelism Models
They try to define a way to structure mapping and data processing

#### Data Parallel
Each data entry has its own process and its own output

### Task Graph
Data entries reach a group of process nodes they all together work to then generate an output

### Pipeline
Data entries followed by a process, followed by a buffer, followd by a process, followed y a buffer which then sends output. Is sequential

### Master Slave
Databases use this configuration a lot, is a modification of variation of the Workpool model, workers in MS are the processes in the pool in Workpool, the master is a process that communicates with slaves which are the processes that do the processing

### Workpool
Some units will be ready to process/transform data, those not doing any processes will be idle, appache web server uses this model. You can access a DOcker container an search in the configurations files you can do `cat conf/extra/htttpd-mpm.conf` and see the "prefork MPM" and other sections

## IPC(Inter Process Communication)
This is how processes communicate in Linux, Windows and MacOs have different implementations or approaches

There are different communication mechanisms, we can see these mechanisms usually in languages like Java and C. The following are local mechanisms, running in the same OS, they share memory(RAM) and CPU clock

### Shared Memory
By default the system doesn't let processes talk each other but there is a space in memory where this is possible

### Message Queues
Processes have an ID and the store info to a 'mail box' using an id, once the message is received the message is deleted, it is lost

### Traffic Lights
If red(1) it can't pass if green(0) it can pass they are binary traffic lights, there is also traffic lights called "counters traffic lights" because they have different states for example: 1, 2, 3

## Critical Region
When a process is accessing resources it is trying to access this function called "critical region", this "critical region" helps implementing an resource access mechanism. It has a "begin" and "end" and in between it has a function call function that access the resources called "critical section"
Over a network, a very famous communication mechanism is "Sockets"

We saw some of this concepts in class 10 like: interbloqueo(deadlock), threads, etc

## Thread Models

### One to many
Many threads inside a program or programs accessing a kernel's process like resources

### One to One
n number of well defined kernel processes will accept request from any number of thread in a program/programs

### Many to Many
Necessary kernel threads are created on demand

## Redis(Message Queue) example
Redis is a key/value database

* run redis on you computer with docker `docker run -it -d redis`
* enter the redis container CLI `docker exec -it <container_id> /bin/bash`
* execute command: `redis-cli`
* We can run commands now like `set a 1`, remember is a key value so "a" is set to 1
* `get a`
* we can use HashTables to store values
* `set studend1 juan`, `set studend2 pedro`
* `set studend:1 juan` and `set studend:1 juan` and then `keys student:*`(gets all students but not the values, it shows the object name and the key), like how many student entries there are
* `set contador 1`, `INCR contador`(increments the variable)
* `keys *` this would returned all the previously defined keys, (a, student1, student2, student:1, student:2, contador) 
* set an auto-expire key `EXPIRE contador 20` this key expires(dissapears) in 20 seconds, see more commands in the official documentation. 
* It is very common to use this as for caching info or info that is very volatile. 
* Hash tables look like `HSET <a_hash_code/a_key> <like_a_column_name> <the_value>`, so we could do an entrie like `HSET student-1 name "lucas"`, `HSET student-1 address "mixco"` and `HSET student-2 name "juan"`, `HSET student-2 address "miraflores"`.
* `KEYS student-*` will print all "student-" keys ("student-1", and "student-2")
* `HGETALL student-1` it will return all fields( "name" "lucas" "address" "mixco")
* `HGETALL student-1 name` just returns the value of the specified field it prints "lucas"
* I can use the redis cli, once inside container's cli run `redis-cli`, try chennels with: `SUBSCRIBE sopes1`, cli will enter to "subscribe mode". Open other terminal and enter the docker container `docker exec -it <container_id> /bin/bash`, run cli `redis-cli`, and now publish a message to the channel we just open with `PUBLISH sopes1 "hola"`
* Kafka can do some channels also it can manange a message channels/queues but originally it was to manage files instead of messages so everything is actually handled as files but they are messages, RabitMQ is an alternative to Kafka
* It can store bytes

Valkey is a Redis fork

# Class 15(20/12/24)

## Linkerd
It manipulates a Kubernetes cluster network, it can encrypt cluster's network traffic, deny services based on rules, route services. Is a service mesh, a service mesh purpose is to improve the internal services network. To accomplish these functionality it puts a child container inside the original service or lives next to it, it receives the network traffic instead of the original container and then it decides what to do. This service mesh also lets you measure the system's observability(golden metrics: success rates, latencies, throughput). And it encrypts communication between services in the cluster, basically is a proxy server. It is not required to modify the application to implement Linkerd. We just make like a 'patch' to have the original container to be injected and then the proxy intercept the traffic and decide what to do. Linkerd has a "data plane" and a "control plane", control plane decides what to do with network traffic and data plane is were services are. So proxy receives network traffic, it asks the control plane what to do and then if necessary the traffic is  directed to the service/application/pod/container in the data plane. Linker is a great and easy way to implement mTLS(mutual TLS) in Kubernetes. You can connect clusters as if they were on the same network. Be aware that in order for the service mesh to work all nodes/services will have to implement Linkerd, this will create the proxy object we mentioned before and this proxy will ask the control plane what to do and all nodes have an instance of a proxy. Be aware you need also to create a 'dummy' pod/container that also has the proxy installed and the proxy of the dummy container talks to the control plane

# Class 16(23/12/24)

## Installing Linkerd in MacOs
Follow steps in [official documentation](https://linkerd.io/2.17/getting-started/). If you get a similar error to " Cannot find Linkerd: the Linkerd clusterNetworks ["10.0.0.0/8,100.64.0.0/10,172.16.0.0/12,192.168.0.0/16,fd00::/8"] do not include svc default/kubernetes (34.118.224.1)" below you'll have the fix instructions.

1. Install the CLI: `curl --proto '=https' --tlsv1.2 -sSfL https://run.linkerd.io/install-edge | sh`

2. Export path either on ".bashrc" or ".zshrc", etc which is the corresponding terminal's file: `export PATH=$HOME/.linkerd2/bin:$PATH`

3. Do precheck: `linkerd check --pre`

4. Check "kubectl" and "cluster" have same version, check the [documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)

5. Install CRDs: `linkerd install --crds | kubectl apply -f -`

6. Install Linkerd: `linkerd install | kubectl apply -f -`

7. Do check to see if service is up: `linkerd check`

8. (Optional) In case you get a "ClusterNetworks error" mentioned above or similar in the previous step you will be given the missing network so copy it and edit the Kubernetes "config map" called "linkerd-config" and add the missing network in the "clusterNetworks" section: `kubectl edit cm linkerd-config -n linkerd`. Be aware this command opens "vi" editor, so use the "vi" commands to edit text

9. Install dashboard components: `linkerd viz install | kubectl apply -f -`

10. (optional) Do check to see if service is up: `linker check`

11. Initiate Dashboard: `linkerd viz dashboard`

12. You can check Linkerd dashboard by now `locahost:50750`

## Linkerd Example
We will be using teacher's repo. Our goal is to use the Linkerd official documentation to split traffic 50/50 using a dummy container 

### Build Docker Containers
They will be pushed to your docker repo

1. Clone Repo `git clone https://github.com/sergioarmgpl/linkerd-workshop.git`

2. `cd linkerd-workshop`

3. `cd app1`

4. `/bin/bash(or sh) build.sh <docker_user>`, this script calls the Dockerfile in this directory also, it is an Apache server. Teacher changed the script because he is using harbor(private registry) instead of a docker hub repo(00:28:00)

5. `cd..`

6. `cd app2`

7. `/bin/bash(or sh) build.sh <docker_user>`, this script calls the Dockerfile in this directory also, it is a http client simulation, it just runs the command `siege -b http://apache`, here it is called apache because we will create a service within the Kubernetes cluster that is called apache and as mentioned in previous notes instead of using the IP address is better to call another service by its name, IP address changes everytime that the cluster is created so it is better to call it by the name. Teacher changed the script because he is using harbor(private registry) instead of a docker hub repo

8. `cd..`

### Create Applications
Set up docker cluster

1. Create Namespace: `kubectl create namespace linkerd-demo`

2. Create Apache server deployment: `kubectl -n likerd-demo create deployment apache --image=<docker_user>/apache`

3. Create service(clusterIp type), this gives the service a "DNS" address: `kubectl -n linkerd-demo expose deployment apache --type=ClusterIp --port=80`

4. Create http client deployment: `kubectl -n likerd-demo create deployment client --image=<docker_user>/client`

5. Expose application locally: `kubectl -n linkerd-demo port-forward svc/apache 8888:80`

6. Check services are up, indicate namespace so it doesn't capture default namespace: `kubectl get pods -n linkerd-demo`, `kubectl get deploy -n linkerd-demo`

8. If all good you can test it on your browser with `127.0.0.1:8888`

7. If you need to debug, copy the pod name that is not running: `kubectl logs pod/<pod_name> -n linkerd-demo`. Or if you need to delete something use `kubectl get deploy -n linkerd-demo`, `kubectl delete deploy <name> -n linkerd-demo`

### Inject Linkerd Proxy into "linkerd-demo" Pods/Applications

1. `kubectl get -n linkerd-demo deploy -o yaml \ 
| linkerd inject - \
| kubectl apply -f -`

2. `kubectl -n linkerd-demo get deployments` or `kubectl get deploy <deploy_name> -n linkerd-demo -o yaml`, the later writes the configurations into a yaml file, in this file we can see the `template:metadata:annotations:linkerd.io/inject: enabled` annotation. The pods should have two containers now, check `kubectl get pods -n linkerd-demo`

3. You can check Linkerd dashboard by now `locahost:50750`

#### (Optional) Use Embedded Grafana

1. Search in the official documentation the instructions but you should see some info indicating the dashboard should have a working instance of "Prometheus", check all components are running `kubectl get ns` copy dashboard namespace(linkerd-viz) and check the pods in the namespace `kubectl get pods -n linkerd-viz`, you should see the Prometheus pod up. The linkerd namespace on the other hand should have the control plane pods(they are not named control plane literally)

3. Install Grafana: `helm repo add grafana https://grafana.github.io/helm-charts
helm install grafana -n grafana --create-namespace grafana/grafana \
  -f https://raw.githubusercontent.com/linkerd/linkerd2/main/grafana/values.yaml`

4. Under "namespaces" you should see a Grafana column and icon. So Check the Apache server plot by clicking on a Grafana icon

5. If grafana not working try to install dashboard again`linkerd viz install --set Grafana.url=Grafana.grafana:3000\
| kubectl apply -f -`

6. You may need to unistall Linkerd dashboard and reinstall: `linkerd viz uninstall -o yaml | kubectl delete -f -` and reinstall with command on step 5 and do a `linkerd check` if you want to confirm is all good

#### Check Linkerd Observability info

1. `linkerd -n linkerd-demo stat deploy`

2. `linkerd -n linkerd-demo top deploy`

3. `linkerd -n linkerd-demo top deploy/client`

#### Injecting Faults
Lets us split network traffic. Look for "Injecting Faults" in Linkerd official documentation. As explained previously, both client and server have injected a proxy, and a 'dummy' container with its proxy has to be created and this proxy is the one that talks to the control plane

1. Copy the error-injector yaml file in the example of official documentation

2. create a yaml in the directory where both, client and server lives: `nano split.yaml` and paste code`

3. Put correct namespace name in all namespace fields

4. create Kubernetes objects `kubectl apply -f split.yaml`, check services `kubectl get svc -n linkerd-demo`

5. Expose this service with a port forward `kubectl port-forward svc/error-injector 6001:8080 -n linkerd-demo`. check on browser it fails "127.0.0.1:6001"

6. Create Dummy Container: `kubectl create deployment dummy --image=apache -n linkerd-demo`, remember apache is the deployment name

7. Check dummy is running: `kubectl get svc -n linkerd-demo`

8. Expose dummy container with a clusterIP service `kubectl -n linkerd-demo expose deployment dummy --type=ClusterIP --port=80`

9. Inject proxy to all(again): `kubectl get -n linkerd-demo deploy -o yaml \
| linkerd inject - \
| kubectl apply -f -`

10.(optional) check pods `kubectl get pods -n linkerd-demo`

11. Check dummy service is working good: `kubectl get svc -n linkerd-demo`

12. Following documentation, we need to get to "Inject Faults" section and copy the app/service that doesn't fail from the documentation(currenctly called "booksapp"). Create a yaml file `inject.yaml`, paste code and put correct namespace, and also the port in "parentRefs:port" tag put 80 and under "rules:backndRefs" one has to be named as the server, in our case is "apache" this is in port 80 and the "error-injector" port will be 8080, put 50 and 50 under each "weight" tag.

13. Build the Kubernetes objects `kubectl apply -f inject.yaml`

14. Depending on your configurations in the "inject.yaml" file you might have an error. That is, if your entry service("parentRefs" tag) is the dummy server and the apache service is a child("backendRef" tag) then the client is sending to the wrong POD so basically we just need to swap between dummy and apache, apache will be the entry (the one declared in "parentRefs" tag) and dummy will be declared in("backendRef" tag), be aware client is not part of the injection at this point, it actually was injected previously. We are using this Hacky solution to avoid recompiling containers

15. If after you check the dashboard there is nothing new indicating traffic success and failure check the pods, `kubectl get pods -n linkerd-demo` if a container has stop like the client this code will bring it back to life(it will be restarted) `kubectl delete pods <pod_name> -n linkerd_demo`, and check logs in traffic recievers if necessary `kubectl logs deploy/error-injector -n nginx linkerd-demo -f`. now the dummy with `kubectl logs deploy/dummy -n linkerd-demo  -f` this one actually return the linkerd-proxy so do a `kubectl logs deploy/dummy -n linkerd-demo apache -f`, here we are specifying we want the logs of the apache server

16. pending from 1:13:00, example was not finished

# Class 17(26/12/24)
We made the 2nd exam and teacher explained 2nd project

## 2nd Project
To install kafka use confluent libraries on the internet there is an example in go, we will be able to see there how to run Kafka queues. we can also check his repo called "CloudNativeNov2023" here we will see how go produces Kafka messages and the consumer which is based on confluent libraries. Use Strimzi to install Kafka, check their quick start documentation

Grafana can be installed using his books repo called "Edge-Computing-Systems-with-Kubernetes" in chapter 11 just take off the volumes section on line 36. We can find a Redis example in chapter 10 and 11, preferably in chapter 10, just ignore volumes

To create Grafana Plots/charts it might be best to use Redis Hash Tables because they can work like counters or we could have two variables, one is like a counter. For example each region, faculty, Assigned can have a hash table. Again use hash tables and counters, that should be all you need

A good start would be installing Kubernetes, Harbor, then create an image in Kubernetes with the credentials to call the Harbor registry, this has to happen in a namespace, then create deployment. then install databases

# Class 18(27/12/24)

## Project 2
Again we saw technologies we need in project 2. We saw how to configure Kafka in Kubernetes following Strimzi guidelines and using confluent libraries to configure the the producer and consumer in Golang. Then we saw hwo to configure a "secret" to be able to access private registry from Kubernetes official documentation [here](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line). Teacher showed how to create a user and set the password of the user in Harbor to be able to execute the Kubernetes command that crates the secret key(01:00:00) and also after that showed what tags are needed to declare the secret in the container/pod level(imagePullSecrets:name). This was tested with a private image of an apache server(httpd), when the deployment is created and running we can check on our website the apache website included by default just listen to your local host in the por you define when you create the deployment using a port-forward Kubernetes service

For final test go to uedi to "parcial 2: Procesos y concurrencia del 13 de diciembre ..." to file "Inter Process Communication(IPC)" page 14, 18 through the end of file. Producer, consumer, "deadlock(exclusion mutua) implementation" and traffic light(semaforo)

Also for the final test read the document in "Final - Aplicacion de concurrencia ..." to file "Libro William - Stallings sobre procesos - Dekker ..", read dekker algorithms chapter 4/book's page 170

Read about "Esquimales", "Filosofos Comensales" and "Barbero Dormilon", "Panaderia de Lamport", "Fumadores de cigarros". Just for the sake of knowledge see "yaeger" and "tracing(tracy)", Also read the "Node.js+MongoDB tecnologias de paralelismo" explains why the combination works great in social networks 

Cloud native Guatemala official community https://community.cncf.io/cloud-native-guatemala/

12 factor app

## Linkerd Commands
* `linkerd uninstall | kubectl delete -f -`: uninstall linkerd

## Kubernetes Commands
* `kubectl apply -f deploy.yaml`: Deploys a cluster
* `kubectl rollout history deploy <deploy_label>`: prints rollout history
* `kubectl get deploy <deploy_label> -o yml`: displays the yml confingurations on CLI
* `kubectl rollout undo deployment/<deploy_name> --to-revision=<revision_number>`: sets your deployment to the configuration in that version
* `kubectl get pods`: shows replicas(pods), use `-A` to see all pods from all namesapces
* `kubectl get deploy`: shows deploys and its replicas info
* `kubectl scale deploy/<depsloy_name> --replicas=5
* `kubectl get rs`: shows replica set
* `kubectl delete -f .`: deletes all objects
* `kubectl get all -n minamespace`: shows all objects
* `kubectl delete pods <pod_name> -n minamespace`: Deletes pods from the POD name in the namespace specified
* `kubectl get pods -o wide`: Kubernetes ip, this shows the pods info including their IP
* `kubectl get nodes`: 
* `kubectl get pods -n kube-system`: you can see the DNS registry there, called "kube-dns" it is in charge to manage the inner network DNS names
* `kubectl get all <-n <namespace_name>>(this is optional)`: returns all objects in a optionally specified namespace if not it could be the default or global namespace objects that will be returned
* `kubectl get nodes`: returns kuberentes nodes names
* `kubectl get nodes -o wide`: returns kuberentes nodes info like IP

Service "project/d-api-rest-grpc" does not have any active Endpoint