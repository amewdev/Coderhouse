import * as userService from "../services/user.service.js";

export const createUsers = async (req, res, next) => {
    const { cant } = req.query;
    try {
        const response = await userService.createUsers(cant);
        res.status(200).json({ users: response });
        next();
    } catch (error) {
        console.log(error);
    }
};

export const getUsers = async (req, res) => {
    const { cant } = req.query;
    try {
        const response = await userService.getUsers(cant);
        res.status(200).json({ users: response, pid: process.pid });
    } catch (error) {
        console.log(error);
    }
};


