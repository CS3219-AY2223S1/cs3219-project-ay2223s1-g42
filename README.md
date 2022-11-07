# CS3219-AY22-23-G42(0) Peer Prep

Instructions for setting up below!

## Run the application locally

### Requirements

1. Install Docker
2. Install Node version 16 and above
3. Create `.env` file for the backend service. The example format could be found [here](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/blob/main/backend/.env.example)
4. Create `.env` file for the frontend services. The example format could be found [here](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/blob/main/frontend/.env-example)


### Install and run in a local environment

1. `yarn local` and wait for Nest to show that it is listening on localhost:5000 (or [::1]:5000)
2. `yarn local:rm` to stop all the docker containers.
   * [:x:] This will remove any data stored on the database.


Yes, it's as simple as that. We've created a script that would handle all the necessary installations and database migrations.
