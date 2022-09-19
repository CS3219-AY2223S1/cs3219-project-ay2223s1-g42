# CS3219-AY22-23-G42(0) Peer Prep

Instructions for setting up below!

## Run the application locally

### Requirements

1. Set up local MySQL database
2. Enter your postgresql connection string in `.env` file:
   `DATABASE_URL=mysql://<username>:<password>@localhost:<port_no>/Users`

### Install and run in a local environment

1. `yarn local` and wait for Nest to show that it is listening on localhost:5000 (or [::1]:5000)
2. `yarn local:rm` to stop all the docker containers.
   * [:x:] This will remove any data stored on the database.

Yes, it's as simple as that. We've created a script that would handle all the necessary installations and database migrations.
