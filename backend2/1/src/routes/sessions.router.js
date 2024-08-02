import { Router } from "express";
import userDao from "../dao/mongoDB/user.dao.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { createToken } from "../utils/jwt.js";

const router = Router();

router.post("/register", passportCall("register"), async (req, res) => {
    try {
        res.status(201).json({ status: "ok", msg: "User created" });
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "error", msg: "Internal Server Error"})
    }
});

router.post("/login", passportCall("login"), async (req, res) => {
    try {
        const user = await userDao.getByEmail(req.body.email);
        const token = createToken(user);
        res.cookie("token", token, { httpOnly: true, maxAge: 10*1000 });
        return res.status(200).json({ status: "ok", payload: req.user, token });
  } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", msg: "Internal server error" });
  }
});

router.get("/current", passportCall("jwt"), async (req, res) => {
    res.status(200).json({ status: "ok", user: req.user });
});

export default router;