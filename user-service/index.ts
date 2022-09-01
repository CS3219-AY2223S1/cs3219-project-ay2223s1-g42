import express from "express";
import cors from "cors";

import {
  createUser,
  updateUser,
  deleteUser,
  findUser,
} from "./controller/user-controller";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
//app.options("*", cors());

// Controller will contain all the User-defined Routes

app.get("/:userId", findUser);
app.post("/", createUser);
app.put("/", updateUser);
app.delete("/", deleteUser);

/*
app.use("/api/user", router).all("*", (_, res: any) => {
  res.setHeader("content-type", "application/json");
  //res.setHeader("Access-Control-Allow-Origin", "*");
});
*/

app.listen(8000, () =>
  console.log("user-service listening on port 8000. http://localhost:8000")
);
