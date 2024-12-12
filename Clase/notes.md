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