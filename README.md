# distribunity-api

Web Applications course backend for "Distribunity", an inventory management software built in Express and TypeScript.

In this web application, registered users can create organizations (a generalization of businesses and companies),
invite other users with invitation codes or join other organizations, manage inventories inside their organizations and
manage items inside the inventories; organization admins can manage their organizations' members, organizations' roles,
roles' permissions and the roles assigned to the members.

## Web Applications course

--------------------
**Kolegij:** [_Web aplikacije_](http://ntankovic.unipu.hr/wa)  
**Mentor:** _doc. dr. sc. Nikola Tanković_  
**Student:** _Alan Burić (TFPU)_

--------------------

## Project setup

```
npm ci
```

## Development mode

Development mode means that the backend API server will run 
on your computer, while the Redis and PostgreSQL services 
will run in Docker.

1. Configure your `.env` file:

The services will have to be targeted as localhost and by the services' ports, 
since the backend will see the services as hidden behind a single container 
host rather than multiple hosts when ran in a container.

- change `REDIS_URL=redis://redis:6379` to `REDIS_URL=redis://localhost:6379`
- change `PGHOST=database` to `PGHOST=localhost`

2. Start the services in Docker:

```
docker compose up database redis -d
```

The `-d` flag runs the services in background.

3. Start the server locally:

```
npm run dev
```

## Compilation for production

```
npm run build
```

## Caching levels of database results

1. Express.js response locals level
2. Shared in-memory server-wide cache