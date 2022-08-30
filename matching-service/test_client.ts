import { MatchMakingClient } from "./src";

// example function to handle whatever you sent back from the server on each client.
// if you don't pass a results function to the server object then args will be in form
// {
//  client: object you passed to client.match(),
//  opponent: object this client was matched with
//  }
// otherwise it will be whatever the results function you passed to the server returns.
const client_match_result_handler = (args) => {
  // eg. you might call client_post_match(args); here
  console.log(`client received results:\n${JSON.stringify(args)}`);
};

// create client operator and pass in handler function
// call client.match({PLAYER_OBJECT}) to add a player to the pool.
const client = new MatchMakingClient(
  "ws://127.0.0.1:8001",
  client_match_result_handler
);

// example PLAYER_OBJECT:
// {
//  id: string | number (EVERY PLAYER OBJECT SENT TO THE SERVER MUST HAVE THIS PROPERTY)
//  ... any other properties you want
// }

const player_1 = { id: 1, elo: 150, power: 700, name: "John" };
client.match(player_1);

const player_2 = { id: 2, elo: 320, power: 900, name: "Sergio" };
client.match(player_2);

const player_3 = { id: 3, elo: 380, power: 300, name: "Brooklyn" };
client.match(player_3);

const player_4 = { id: 4, elo: 160, power: 450, name: "Miguel" };
client.match(player_4);

// let i = 5;
// setInterval(() => {
//     client.match({id: i, elo: 300});
//     i++;
// }, 200);
