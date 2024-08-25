import { createToken } from "../utils/jwt.js";
import userServices from "../services/user.services.js";
import { userDto } from "../dto/user.dto.js";

const register = async (req, res) => {
    try {
        res.status(201).json({ status: "ok", msg: "User created" });
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "error", msg: "Internal Server Error"})
    }
};

const login = async (req, res) => {
    try {
        const user = await userServices.getUser(req.body.email);
        const token = createToken(user);
        res.cookie("token", token, { httpOnly: true, maxAge: 30*1000 });
        const userDTO = userDto(user);
        return res.status(200).json({ status: "ok", userDTO });
  } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

const current = async (req, res) => {
    res.status(200).json({ status: "ok", user: req.user });
}

export default {
    register,
    login,
    current,
}