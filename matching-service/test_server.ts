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
const isMatch = (client1, client2) => {
  // MUST RETURN BOOLEAN
  return Math.abs(client1.elo - client2.elo) < 100;
};

const server = new MatchMakingServer(8001, isMatch, undefined, {
  httpServer: httpServer,
  pollInterval: 1000,
  queueTime: 20000,
});

httpServer.listen(8001);
