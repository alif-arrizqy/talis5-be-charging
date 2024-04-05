
# Talis5 Backend Charging

backend for talis5 charging project




## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

[.env](https://gist.github.com/alif-arrizqy/b960c4ac1c85d99702d79ef331ed3ab5)

## Installation

After clone this repo, install project with npm

```bash
  cd talis5-be-charging
  npm install
```

Build project
```bash
    npm run Build
```

## Databases
Create Postgres database with name `dev_talis5_charging` and migrate table
```bash
    npx prisma migrate dev --name init
```

## Running project
run the project in dev mode
```bash
    npm run dev
```
    