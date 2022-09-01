# CS3219-AY22-23-G42(0) PeerPussies

Instructions for setting up below!

## User Service

1. Set up local postgres database
2. Enter your postgresql connection string in `.env` file:
   `DATABASE_URL=postgres://<username>:<password>@localhost:<port_no>`
3. Install npm packages using `yarn`
4. Create migration with `yarn prisma migrate dev`
5. Generate prisma database client with `yarn prisma generate`
6. Run User Service using `yarn dev`.

## Matching Service

1. Install npm packages using `yarn`
2. Run server with `yarn dev:server`
3. Run test clients with `yarn dev:client`

## Frontend

1. Install npm packages using `npm i`.
2. Run Frontend using `npm start`.
