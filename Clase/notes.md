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



