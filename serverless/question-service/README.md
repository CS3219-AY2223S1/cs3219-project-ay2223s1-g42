# `question-service`

## Installing

Assuming that you have cloned the entire repository.

```bash

# Enter the question-service directory
cd serverless/question-service

# Install all dependencies
yarn

```
To develop locally, create a `.env.local` file and fill it up appripriately with MySQL connection string as follows:

```bash
DATABASE_URL="mysql://USERNAME:PASSWORD@HOSTNAME:PORT/questionService"
```

## Developing

As we are using Firebase Functions (similar to Google's Cloud Functions), Firebase needs to be set up before we can run it locally.

```bash
# Install firebase-tools
npm install -g firebase-tools

# Login to Firebase 
firebase login

# Manually start a local functions emulator
yarn serve

# Ensure that the Test portion in "src/index.ts" has been un-commented.
# The "test" block is triggered by HTTP request while the production blocks 
# functions similarly to cron jobs.
```

## Secrets Manager

```bash
# Create/update the value of a secret.
firebase functions:secrets:set SECRET_NAME
# You will be prompted to enter the secret value.
# This is can be your key/credentials/connection strings.

# Read the value of a secret
firebase functions:secrets:access SECRET_NAME

# Delete a secret
firebase functions:secrets:destroy SECRET_NAME

# Prune unused secrets
firebase functions:secrets:prune
```