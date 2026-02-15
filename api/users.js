import express from "express";
import requireBody from "../middleware/requireBody.js";
import { createUser, getUserByUsernamePassword } from "../db/queries/users.js";
import { createToken } from "../utils/jwt.js";

const router = express.Router();


router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    console.log("here's the req.body: ", req.body)
    const user = await createUser(req.body);
    const token = createToken({ id: user.id });
    res.status(201).send(token);
  }
);


router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const user = await getUserByUsernamePassword(req.body);
    console.log("here's the user: ", user);
    if (!user) {
      res.status(401).send("Invalid username and/or password");
    }
    const token = createToken({ id: user.id });
    res.send(token);
  }
);

export default router;
