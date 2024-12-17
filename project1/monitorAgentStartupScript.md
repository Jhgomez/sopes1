sudo apt-get update && sudo apt-get install ca-certificates curl -y
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# clone git
git clone https://github.com/Jhgomez/kernelModules.git

# install linux headers
sudo apt-get install linux-headers-generic -y

# install make
sudo apt-get install make

# install gcc
sudo apt-get install gcc -y
# make sure is the latest
sudo apt install --reinstall gcc-12

# cd, build with make and install module
cd ~/kernelModules/CPU
make all
sudo insmod cpu.ko

cd ~/kernelModules/RAM
make all
sudo insmod ram.ko

# cd and run docker compose
cd ~/kernelModules
sudo docker compose up

# cd to default
cd ~

















# install git
sudo apt-get install git

# generates key
ssh-keygen -t ed25519 -N '""' -f ~/.ssh/id_ed25519
# starts agent
eval "$(ssh-agent -s)"
# add key
ssh-add ~/.ssh/id_ed25519


# checks added keys
ssh-add -l -E sha256 


# Registrar git hub como host
echo "Host github.com" > ~/.ssh/config
echo "  HostName github.com" >> ~/.ssh/config
echo "  AddKeysToAgent yes" >> ~/.ssh/config
echo "  IdentityFile ~/.ssh/id_ed25519" >> ~/.ssh/config
echo "  UserKnownHostsFile ~/.ssh/known_hosts" >> ~/.ssh/config
echo "  PubKeyAuthentication yes" >> ~/.ssh/config

# chmod  0700 ~/.ssh
# chmod 600 .ssh/*
# cd /etc/ssh/ssh_config sshd_config

# 132
chmod 600 ~/.ssh/config 

# add git to known hosts as per this post https://github.blog/news-insights/company-news/we-updated-our-rsa-ssh-host-key/
echo github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk= > ~/.ssh/known_hosts

