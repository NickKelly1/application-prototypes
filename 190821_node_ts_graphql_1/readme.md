# TODO: documentation

## Dev Environment

Docker can be used to create containers housing applications, allowing the the creation of reliable, consistent environments for development and production. However, Docker does come with operational overhead as it takes time to learn and creates additional layers where issues can arise.

This repo's docker-compose-dev.yml file provides a fully fledged development environment, started with `docker-compose -f docker-compose-dev.yml up`.
As development is ongoing, the docker-compose-dev.yml file may be changed to suit development needs (such as removing the server's container so it can temporarily be run on the host machine until networking issues with the compose file are resolved).

### Docker commands:

- **run docker-compose**: `docker-compose -f docker-compose-dev.yml up`
- **run docker-compose**: `docker-compose -f docker-compose-dev.yml up --build`
- **stop docker-compose**: `docker-compose down`
- **kill docker-compose**: `docker-compose kill`
- **Docker container shell**: winpty docker exec -it <container_name> sh

### Docker resources:

- [https://github.com/wsargent/docker-cheat-sheet](Docker cheatsheet)

Notes:

- See [this](https://github.com/docker/for-win/issues/1746) If having issues using docker on a Windows 10 machine that previously had Docker-Toolbox


## Postgres

This application uses a Postgres database that can be hosted in a docker container or on the host machine.

Postgres on Window
Even if running Postgres from a docker container, you'll still want a client for development
Two popular clients are pgAdmin (web interface) and psql (cli)
These clients (as well as an optional Postgres Server) can be downloaded from [Enterprise Postgres](enterprisedb.com/downloads/postgres-postgresql-downloads)

### Useful psql cli commands

The psql executable is located at /c/Program Files/PostgreSQL/<version | 11>/bin


- **connect**: winpty psql.exe --username=<username> --dbname=<dbname>
- ...TODO


### Postgres resources:

- [Postgres docker container](https://hub.docker.com/_/postgres)



