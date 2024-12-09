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