# `question-service`

## Background

The `question-service` is deployed on Firebase Cloud Functions to do the following:

1. Update the questions' summary which consists of "summary" data such as acceptance rate, difficulty, and topics,
2. Update the daily question to follow LeetCode's, and
3. Update the questions' content -- actual question, context, and hints, if any.

Firebase Cloud Functions was used for the following reasons:

1. Works with GCP Cloud Scheduler and PubSub to simiulate cron jobs to update the database periodically, and
2. Allows updating of questions regardless of the status of the `backend` (decouples from `backend`)

## Preperation

PlanetScale is used to store the question summaries and contents as they are relational in nature and it allows for future upgrades to the application as a whole.

1. [PlanetScale](https://planetscale.com/)
   * Free hosted SQL database with Git-like features for schema management.
   * Very similar to MySQL [with some caveats](https://planetscale.com/docs/reference/mysql-compatibility).
2. [Prisma](https://www.prisma.io/)
   * ORM for PlanetScale, makes working with SQL databases easier.
   * Works well with PlanetScale with regards to schema management.

## Installing

### Developer Environment

It is highly recommended to use a "development" branch of PlanetScale for local development as it is less of a hassle to setup than a local environment as all that is needed is to create a new branch from the main one via PlanetScale's web UI and save the connection string in a .env as shown.

```bash
# Enter the question-service directory
cd serverless/question-service/functions

# Install all dependencies
yarn

```

Create a `.env` file and fill it up appripriately with MySQL connection string as follows. Note that the `sslaccept=strict` is required.

```bash
DATABASE_URL="mysql://USERNAME_FROM_PSCALE:PASSWORD_FROM_PSCALE@HOST_FROM_PSCALE/BRANCH_DB_NAME?sslaccept=strict"
```

As we are using Firebase Functions (similar to Google's Cloud Functions), Firebase needs to be set up before we can run it locally.

```bash
# Install firebase-tools
npm install -g firebase-tools

# Login to Firebase 
firebase login

# Ensure that the right project is being used

# Manually start a local functions emulator
yarn serve

# Ensure that the Test portion in "index.ts" has been un-commented.
# The "test" block is triggered by HTTP request while the production blocks 
# functions similarly to cron jobs.
```

### Local Environemnt

[This write-up](https://planetscale.com/docs/tutorials/prisma-quickstart) goes over how to develop with a local instance of PlanetScale.

## Secrets Manager

This can be used to pass the connection string into the Cloud Function

```bash
# Create/update the value of a secret.
firebase functions:secrets:set SECRET_NAME
# Paste your secret when prompted

# Read the value of a secret
firebase functions:secrets:access SECRET_NAME

# Delete a secret
firebase functions:secrets:destroy SECRET_NAME

# Prune unused secrets
firebase functions:secrets:prune
```

## Troubleshooting

1. `question-service` works locally, but does not run when deployed
    * Ensure that:
      1. The project structure is followed.
      2. The secrets can be read.
      3. Functions are redeployed when Secrets Manager is updated.

## Furhter Details

For more details, refer to the following:

1. `tech-details.md` for how the question service was initially designed,
2. `prisma/schema.prisma` for the schema being used and the relations,
3. [Getting started with Prisma](https://www.prisma.io/docs/getting-started), and
4. Things to note when [using Prisma with PlanetScale](https://www.prisma.io/docs/guides/database/using-prisma-with-planetscale).
