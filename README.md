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

## Local development mode

1. Start the database in Docker:

```
docker compose up database
```

2. Start the server locally:

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