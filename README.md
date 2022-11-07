# CS3219-AY22-23-G42(0) Peer Prep

Instructions for setting up below!

## Run the application locally

### Requirements

1. Install Docker
2. Install Node version 16 and above
3. Create `.env` file for the backend service. The example format could be found [here](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/blob/main/backend/.env.example)
4. Create `.env` file for the frontend services. The example format could be found [here](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/blob/main/frontend/.env-example)
5. [PlanetScale](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/tree/main/serverless/question-service/functions#preperation) which is used to store the question summaries and contents.


### Install and run in a local environment
1. `yarn build` will generate the prisma schemas, install the node dependencies for both backend and frontend.
2. `yarn local`/`yarn dev` will run the application based on the `.env.local` or `.env` file respectively. After running the commnad, wait for Nest to show that it is listening on localhost:5000 (or [::1]:5000)
3. `yarn local:rm`/`yarn dev:rm` to stop all the docker containers.
   * [:x:] This will remove any data stored on the database.


### Question Service
- The Question details are stored in our free hosted PlanetScale server.
- The Questions are seeded at intervals, click [here](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/tree/main/serverless/question-service/functions#seeding-the-database) for more information regarding the process. 

Yes, it's as simple as that. We've created a script that would handle all the necessary installations and database migrations.
