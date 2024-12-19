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

# Class 6

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
Is a software that lets track energetic Kubernetes comsumption. Other tools that helps track and leverage resources efficiently is registry softwares like Harbor. Most used container registries  are administrated by the cloud providers or docker

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


# Class 7
Non-functional attributes, system attributes

## Golden Metrics
Latency, Traffic, Errors, Saturation. 

In class we made and example of configuring Grafana with MySQL using docker compose. The goal was to load info to MySQL db and generate plots with grafana

1. Generate a docker compose file using copilot, prompt was similar to: "generate a docker-compose.yml file to run graphana and MySQL on my local computer". Build the compose file and go to localhost:3000, that is where Grafana is listening

2. get the info, use `ps -aux` to see resource usage by process and do `ps -ax | awk '{print $1,$4} | tail -5' this will print last 5 processes number and the command it is executing

# Class 8
## Processes
In SO GNU/Linux we can find the processes info in "/proc", a directory is created for each process ID, so basically a list of processes ID. A host can monitor/see a guest processes info. You can enter a process directory and check more file with the process info there, like "statm" which is the memory used by the process

Commands to manage processes in GNU/Linux due to kernel's monolithic nature: 
* `ps -aux`: Lists all processes and its info
* `kill <PID>>`: Kills a process being executed
* `kill -a <PID>`: Force to kill a process
* `killall <name>`: Force to kill process by name
* `top` and `htop`: Monitors processes in real time

There is three concepts we need to know when talking about processes:

* Process: Is a program in execution
* Task: Is creation of the process resources
* Thread: Is the unit of a process execution

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

# Class 10

## Parallelism and Concurrency

### Monoprogramming(sequential)
Just one program executes in a process at a time

### Multiprogramming(Paralel/Asynchronous)
Programs alternates execution over the same process, it looks like they being executed separately however they are in the same process acutally

### Concurrency
Several programs exists at the same time but only one is executed, most of the times means there is only one CPU

#### Inheritably and Potential Concurrency
Inheritably when they are forcibly executing actions simultaneously due to the nature of its environment, cashiers. Doesn't need to  be concurrent but it will benefit the system to speed up cexecution  

### Parallelism
Exists more than one CPU so more than one program is executed at the same time. Is a particular case of concurrency, basically two or more concurrency executions are happening. Multiprocessors are needed to use parallelism

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

# Class 11

## Something with K8
Teacher was not recording the class so I couldn't know what he talked about first.



`container clusters k8s-demo --num-nodes=1 --tags=allin,allout --machine type=n1-standard-1 --no-enable-network-policy`

It is possible through google's cloud service called GKE 

Search "Deployment Rollout in Kubernetes". The Kubernetes rollout annotation description is done with `Kubernetes.io/change-cause

this is a deployment file: 

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

`httpd` is apache web server in docker hub

## Kubernetes Deployments
We can have more than one ".yaml" file in a folder. When K8 creates a deployment it create a replica set that controls the pods replicas quantity. The name of the pods have a part of the name of the replica set plus something added to it

`kubectl scale --replicas=<quantity> --image=<image_name>`
`kubectl scale --replicas=<quantity> --deployment/<deploy_name>`
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

## Troubleshooting pods
Be aware Kubernetes creates a default namespace, when the cluster is created in the default namespace this argument can be removed

* `kubectl run -it client --rm --image=busybox \ --restart=Never -n minamespace -- sh`: creates a temporary small POD which can help debug, busybox is small build. It is removed on exit due to `-rm` flag
* `kubecl run -it curl --rm--image=alpine/curl \ --restart=Never --curl http://<a sevice address, it can be a pod ip address, a hostname, inclue por or not>`: if you connect to a POD within your network for example apache web serer you will get some response
* `kubectl exec -it <pod_name> -n minamespace -- [bash|sh]`: helps access inside pod CLI
* `kubectl exec -it <pod_name> -c minamespace -- [bash|sh]`: helps access inside pod CLI
* `kubectl describe pods <pod_name> -n mynamespace`: gives info about the pod

## Services
To this commands we can add `-o yaml --dry-run` to get the yaml printed on CLI. Kubernetes can talk to another service but you have to move firewall and create rules to be able to do it. When you set up a service it generates the "yaml" serice yaml file and again the labels will match labels in deploy and/od files

* `kubectl expose deployment <label_name> --port=<port> --target-port=<port> --type=ClusterIP`
* `kubectl expose deployment <label_name> --port=<port> --target-port=<port> --type=NodePort`
* `kubectl expose deployment <label_name> --port=<port> --target-port=<port> --type=LoadBalancer`
* `kubectl get serices <my_service_name> -o yaml > <name>.yaml` and `kubectl apply -f servic.yaml`: helps edit a service file
* `kubectl expose deployment <label_name> --port=80 --target-port=80 --type=LoadBalancer`: Sets up a load balancer

examples:
* `kubectl expose deploy/nginx --port=80 --type=LoadBalancer --dry-run -o yaml >> deploy.yaml`


** Kubernetes Operators
Is an object that makes a deployment, so we can just send parameters to the operator and the operator makes the deployment. "Helm" is a software that help us create these K8 operators, Helm makes installing packages very easily

## Kubernetes Roll Outs

Kubernetes roll outs are a very powerful feature, we can change versions and even contianers very easily 

Kubernetes Commands
* `kubectl apply -f deploy.yaml`: Deploys a cluster
* `kubectl rollout history deploy <deploy_label>`: prints rollout history
* `kubectl get deploy <deploy_label> -o yml`: displays the yml confingurations on CLI
* `kubectl rollout undo deployment/<deploy_name> --to-revision=<revision_number>`: sets your deployment to the configuration in that version
* `kubectl get pods`: shows replicas(pods), use `-A`
* `kubectl get deploy`: shows deploys and its replicas info
* `kubectl scale deploy/<deploy_name> --replicas=5
* `kubectl get rs`: shows replica set
* `kubectl delete -f .`: deletes
* `kubectl get all -n minamespace`
* `kubectl delete pods <deploy_name> -n minamespace` 
* `kubectl get pods -o wide`: Kubernetes ip, this shows the pods info including their IP

