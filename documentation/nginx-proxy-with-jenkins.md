# Adding Jenkins behind Nginx Proxy

## Create Network

`$ docker network create nginx_network`

## Create Volume

`$ docker volume create jenkins_home`

## Jenkins docker-compose.yml

```yml
version: "3.7" # choose the appropriate version based on your Docker environment

services:
  jenkins:
    image: jenkins/jenkins:lts # use the latest LTS version from the official Jenkins repo
    container_name: jenkins
    ports:
      - "8080:8080" # map Jenkins web UI port to the host
      # - "50000:50000" # map Jenkins agent port to the host (optional, only needed if you're attaching build agents)
    volumes:
      - jenkins_home:/var/jenkins_home # mount the Jenkins home directory from the named volume below
      # If you want to use Docker within your Jenkins builds, you can uncomment the line below to mount the Docker socket
      # - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - nginx_network
    environment:
      JENKINS_OPTS: --httpPort=8080 # additional options; here, we set the running port
      # You can set additional environment variables that Jenkins will use upon start-up
      # JAVA_OPTS: "-Xmx2048m"  # for example, to control Java memory settings

volumes:
  jenkins_home: # named volume for Jenkins data, making it persistent across container restarts
    external: true # set this to false if you want Docker to handle the creation of the volume

networks:
  nginx_network:
    external: true
```

## Nginx docker-compose.yml

```yml
version: "3.9"
services:
  nginx:
    build:
      context: .
      dockerfile: Dockerfile.nginx
    restart: on-failure
    ports:
      - "443:443"
    networks:
      - nginx_network

networks:
  nginx_network:
    external: true
```
