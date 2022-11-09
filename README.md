# CS3219 AY22/23 G42 PeerPrep

PeerPrep is a platform that allows its users to match with each other and give them the opportunity to work together on an algorithmic problem. In doing so, users can also simulate interviews by assuming the role of interviewer-interviewee, or work as a pair to solve a problem together.

## Run the application locally

### Requirements

1. Install [Docker and docker-compose](https://firebase.google.com/docs/cli#install-cli-mac-linux) for your OS.
2. Install [Node.js 16](https://nodejs.org/download/release/v16.18.1/)
3. Create `.env` file for the [backend](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/blob/main/backend/.env.example), [frontend](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/blob/main/frontend/.env-example), and [serverless](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/blob/main/serverless/question-service/functions/.env.example) respectively
4. Create and set up an account with [PlanetScale](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/tree/main/serverless/question-service/functions#preperation), which is the main database of PeerPrep, and take note of the connection string
5. Install [firebase-tools](https://firebase.google.com/docs/cli#install-cli-mac-linux) via NPM, login and ensure that the correct project is being used or create a new one

### Install and run in a local environment

1. Populate the question database in Planetscale, do note that this process is time-consuming due to the rate limit from LeetCode.
   * Full details on how the question service works can be seen [here](https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g42/tree/main/serverless/question-service/functions#seeding-the-database).

``` bash
# Enter question-service dir
cd serverless/question-service/functions

# Create .env following .env.example

# Install dependencies
yarn

# Uncomment the code below the "SEED" comment and  start the emulator locally 
# Take note of the summary and content endpoints
yarn serve

# In another terminal, run the script to seed the database with questions
./seed.sh <SUMMARY_ENDPOINT> <SLEEP_DURATION_IN_SECONDS>
./seed.sh <CONTENT_ENDPOINT> <SLEEP_DURATION_IN_SECONDS>

# Example: ./seed.sh "http://localhost:5001/proj/region/seedSummary" 10
# Example: ./seed.sh "http://localhost:5001/proj/region/seedContent" 10
```

2. Run the application after populating the question database. Without it, users would not be able to match by topics/daily question and would not be served any question upon matching.

```bash
# Install dependencies and build assets
yarn build

# Ensure that the backend and frontend has a .env
# Refer to Requirements step 3

# Run the application
yarn dev

# Clean up the application after stopping, flushes local Redis instance
yarn dev:rm
```
