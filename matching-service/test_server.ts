import express from "express";
import cors from "cors";
import { createServer } from "http";

import { MatchMakingServer } from "./src";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
// app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello World from matching-service");
});

const httpServer = createServer(app);

// matching logic
const is_match_func = (client_1, client_2) => {
  // MUST RETURN BOOLEAN
  return Math.abs(client_1.elo - client_2.elo) < 100;
};

const server = new MatchMakingServer(8001, is_match_func, undefined, {
  https_server: httpServer,
  poll_interval: 1000,
  queue_time: 20000,
});

httpServer.listen(8001);
