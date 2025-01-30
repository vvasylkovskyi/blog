# Dependencies required on the machine - TODO add dockerfile

apt install npm

# Installing Portainer, Docker on VM

1. Install docker
   - `$ apt install docker.io`

## Portainer - https://docs.portainer.io/start/install/server/docker/linux

1. Create volume for portainer to store its database

   - `$ docker volume create portainer_data`

2. Download and install the Portainer Server container:
   - `docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ee:latest`

## Start/Stop docker via system

1. `$ sudo systemctl start docker`
2. `$ sudo systemctl stop docker`

## Nginx with Docker - https://www.digitalocean.com/community/tutorials/how-to-run-nginx-in-a-docker-container-on-ubuntu-22-04

1. Pull Nginx with dockerp
   - `$ docker pull nginx`
2. Run Nginx with docker
   - `$ docker run --name docker-nginx -p 80:80 nginx`
3. Running Nginx with Docker in a detached mode
   - `$ docker run --name docker-nginx -p 80:80 -d nginx`
4. Stop Container from running
   - `$ docker stop docker-nginx`
5. Remove Container
   - `$ docker rm docker-nginx`
6. Mapp my local nginx file to docker container
   - `$ docker run --name docker-nginx -p 80:80 -d -v ~/docker-nginx/html:/usr/share/nginx/html nginx`
7. Using custom Configuration File

- Get an nginx.conf file into your local directory. Make changes to it, and then map it to the docker volume
- `$ docker run --name docker-nginx -p 80:80 -v ~/docker-nginx/html:/usr/share/nginx/html -v ~/docker-nginx/default.conf:/etc/nginx/conf.d/default.conf -d nginx`

## Docker Compose - https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04

1. add CLI plugins folder
   - `$ mkdir -p ~/.docker/cli-plugins/`
2. Download docker compose latest version from https://github.com/docker/compose/releases . Ex:
   - `$ curl -SL https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose`
3. Add correct permissions
   - `$ chmod +x ~/.docker/cli-plugins/docker-compose`
4. Check version
   - `$ docker compose version`
5. Follow tutorial above to create `.yml` file ready to get up

6. Spin up docker compose service
   - `$ docker compose up -d`
7. Check docker compose running
   - `$ docker compose ps`

# Install Docker Images on remote host (VM) - https://stackoverflow.com/questions/44201625/can-i-build-a-docker-container-from-the-cli-against-a-remote-daemon

1. Add an ssh key

   - `$ ssh-add -k ~/.ssh/vvasylkovskyi-ssh`

2. Install docker image to the remote machine

   - `$ docker -H ssh://root@167.71.136.89 build .`

3. Run container on VM
   - `$ docker run -p 80:80 --name neo-raspberry-nginx -d nginx`

# Docker Registry

1. Pull registry image

   - `$ docker run -d -p 5000:5000 --restart=always --name registry -v /mnt/registry:/var/lib/registry registry:2`

2. Tag and push Image to registry

   - `$ docker tag neo-raspberry-nginx analytics.vvasylkovskyi.com:5000/neo-raspberry-nginx`
   - `$ docker push 127.0.0.1:5000/neo-raspberry-nginx`
   - `$ docker pull analytics.vvasylkovskyi.com:5000/neo-raspberry-nginx`

3. Stop Registry

   - `$ docker container stop registry && docker container rm -v registry`

## Run registry with HTTPS

- Move the certificates to the VM, and then start docker registry with TLS

```sh
   docker run -d \
  --restart=always \
  --name registry \
  -v /certs:/certs \
  -e REGISTRY_HTTP_ADDR=0.0.0.0:5000 \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/vvasylkovskyi_com.pem \
  -e REGISTRY_HTTP_TLS_KEY=/certs/vvasylkovskyi_com.key \
  -p 5000:5000 \
  registry:2
```

## Restricting Access

- Assumes that TLS is configured.
- Create a `auth` folder with

```
docker run --entrypoint htpasswd httpd:2 -Bbn testuser testpassword > auth/htpasswd
```

```
docker run -d \
  -p 5000:5000 \
  --restart=always \
  --name registry \
  -v /auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  -v /certs:/certs \
  -e REGISTRY_HTTP_ADDR=0.0.0.0:5000 \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/vvasylkovskyi_com.pem \
  -e REGISTRY_HTTP_TLS_KEY=/certs/vvasylkovskyi_com.key \
  registry:2

```

### Login into registry

- `$ docker login docker-registry.vvasylkovskyi.com:5000`

# Default Flow of the Docker Image

## On the host

```sh
$ docker container stop registry && docker container rm -v registry

$ docker run -d --restart=always --name registry -v /certs:/certs -e REGISTRY_HTTP_ADDR=0.0.0.0:5000 -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/vvasylkovskyi_com.pem -e REGISTRY_HTTP_TLS_KEY=/certs/vvasylkovskyi_com.key -p 5000:5000 registry:2

$ docker tag neo-raspberry-server 127.0.0.1:5000/neo-raspberry-server

$ docker push 127.0.0.1:5000/neo-raspberry-nginx
```

## On the client

`docker pull docker-registry.vvasylkovskyi.com:5000/neo-raspberry-nginx`

# TODO - Recipe with Nginx - https://docs.docker.com/registry/recipes/nginx/

## Publishing image to Docker Hub

First build the images for the architecture that you want

```sh
docker build -f Dockerfile.server -t vvasylkovskyi1/blog-server --platform linux/amd64 .
docker build -f Dockerfile.nginx -t vvasylkovskyi1/blog-nginx --platform linux/amd64 .
```

Then, push the images into the docker hub

```sh
docker push vvasylkovskyi1/blog-nginx
docker push vvasylkovskyi1/blog-server
```

Finally, use the images on VM with docker-compose configuration such as

```yml
version: "3.9"
services:
  nginx:
    image: vvasylkovskyi1/blog-nginx:latest
    restart: on-failure
    ports:
      - "443:443"
```

If using `latest`, make sure to pull the docker image using `pull` command

```sh
docker pull vvasylkovskyi1/blog-nginx
docker pull vvasylkovskyi1/blog-server
```

`
