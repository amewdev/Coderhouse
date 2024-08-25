import jwt from "jsonwebtoken";
import envs from "../config/envs.config.js";

export const createToken = (user) => {
    const token = jwt.sign({user}, envs.JWT_SECRET_CODE, {expiresIn: '30s'} );
    return token;
}

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, envs.JWT_SECRET_CODE)
        return decoded;
    } catch (error) {
        return null
    }
}