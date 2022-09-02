import express from "express";
import cors from "cors";

import * as UserController from "./controller/user-controller";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
//app.options("*", cors());

// Controller will contain all the User-defined Routes
app.get("/:userId", UserController.findUser);
app.post("/", UserController.createUser);
app.put("/", UserController.updateUser);
app.delete("/", UserController.deleteUser);
app.post("/login", UserController.loginUser);
/*
app.use("/api/user", router).all("*", (_, res: any) => {
  res.setHeader("content-type", "application/json");
  //res.setHeader("Access-Control-Allow-Origin", "*");
});
*/

app.listen(8000, () =>
  console.log("user-service listening on port 8000. http://localhost:8000")
);
