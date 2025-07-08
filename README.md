# distribunity-api

Web Applications course backend for "Distribunity", an inventory management software built in Express and TypeScript.

In this web application, registered users can create organizations (a generalization of businesses and companies),
invite other users with invitation codes or join other organizations, manage inventories inside their organizations and
manage items inside the inventories; organization admins can manage their organizations' members, organizations' roles,
roles' permissions and the roles assigned to the members.

> [!CAUTION]
> This repository will be renamed to `distribunity` after the current `distribunity` repository is renamed to `distribunity-firebase`. Besides the backend API initially, it now contains the frontend so that it functions as a monorepo.

## Web Applications course

--------------------
**Kolegij:** [_Web aplikacije_](http://ntankovic.unipu.hr/wa)  
**Mentor:** _doc. dr. sc. Nikola Tanković_  
**Student:** _Alan Burić (TFPU)_

--------------------

## Technology stack

- **Backend:** HTTP(S) REST API Express server running on Node
- **Database:** PostgreSQL, without an ORM
- **Cache:** Redis for authentication token blocklists, and database enums and common operations
- **Frontend:** Vue, Pinia, Vite
- **Deployment:** Docker

## Project setup

```
npm ci
```

## Development mode

Development mode means that the backend API server will run 
on your computer, while the Redis and PostgreSQL services run in Docker.

1. Configure your `.env` file as a copy of `.env.example`, in the `backend` directory:

The services will have to be targeted as localhost and by the services' ports, 
since the backend will see the services as hidden behind a single container 
host rather than multiple hosts when ran in a container.

- change `REDIS_URL=redis://redis:6379` to `REDIS_URL=redis://localhost:6379`
- change `PGHOST=database` to `PGHOST=localhost`

2. Start the services in Docker:

```
docker compose --profile dev up -d
```

The `-d` option runs the services in background.

3. Start the development backend and frontend servers locally

Assuming that each block of commands is ran from the root directory:

```
cd backend
npm run dev
```

```
cd frontend
npm run dev
```

## Running in production

Run `docker compose --profile prod up -d`. Visit the IP address of the host machine in your browser.