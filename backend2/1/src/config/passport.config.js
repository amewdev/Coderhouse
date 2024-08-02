import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import userDao from "../dao/mongoDB/user.dao.js";
import cartDao from "../dao/mongoDB/cart.dao.js";
import envs from "./envs.config.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import { cookieExtractor } from "../utils/cookieExtractor.js";

const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, email, age, role } = req.body;
                    const user = await userDao.getByEmail(username);
                    if (user) return done(null, false, { "message" : "User already exists" });

                    const cart = await cartDao.create();

                    const newUser = {
                        first_name, last_name,
                        age,
                        email, password: createHash(password),
                        cart: cart._id,
                        role: role || "user"
                    };
                    const createdUser = await userDao.create(newUser);
                    return done(null, createdUser);
                } catch (error) {
                    return done(error)
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField : "email"},
            async (username, password, done) => {
                try {
                    const user = await userDao.getByEmail(username);
                    if (!user || !isValidPassword(password, user.password)) return done(null, false, { "message" : "User and password don't match" });
                    return done(null, user);
                } catch (error) {
                    done(error)
                }
            }
        )
    )

    passport.use(
        "jwt",
        new JwtStrategy(
          {jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), secretOrKey: envs.JWT_SECRET_CODE},
          async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
          }
        )
      )

    passport.serializeUser( (user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser( async (id, done) => {
        try {
            const user = await userDao.getById(id);
            done(null, user);
        } catch (error) {
            done(error)
        }
    });
};