import { MatchMakingClient } from "./src";

// example function to handle whatever you sent back from the server on each client.
// if you don't pass a results function to the server object then args will be in form
// {
//  client: object you passed to client.match(),
//  opponent: object this client was matched with
//  }
// otherwise it will be whatever the results function you passed to the server returns.
const clientMatchResultHandler = (args) => {
  // eg. you might call client_post_match(args); here
  console.log(`client received results:\n${JSON.stringify(args)}`);
};

// create client operator and pass in handler function
// call client.match({PLAYER_OBJECT}) to add a player to the pool.
const client = new MatchMakingClient(
  "ws://127.0.0.1:5000",
  clientMatchResultHandler
);

// example PLAYER_OBJECT:
// {
//  id: string | number (EVERY PLAYER OBJECT SENT TO THE SERVER MUST HAVE THIS PROPERTY)
//  ... any other properties you want
// }

const player1 = {
  id: 1,
  email: "user1@asdas.com",
  username: "user1",
  difficulties: ["easy", "hard"],
};
client.match(player1);

const player2 = {
  id: 2,
  email: "user2@asdas.com",
  username: "user2",
  difficulties: ["hard", "medium"],
};
client.match(player2);

const player3 = {
  id: 3,
  email: "user3@asdas.com",
  username: "user3",
  difficulties: ["medium"],
};
client.match(player3);

const player4 = {
  id: 4,
  email: "user4@asdas.com",
  username: "user4",
  difficulties: ["medium", "easy"],
};
client.match(player4);

// let i = 5;
// setInterval(() => {
//     client.match({id: i, elo: 300});
//     i++;
// }, 200);
