import { Router } from "express";
import { passportCall } from "../middlewares/passport.middleware.js";
import userControllers from "../controllers/user.controllers.js";

const router = Router();

router.post("/register", passportCall("register"), userControllers.register);
router.post("/login", passportCall("login"), userControllers.login);
router.get("/current", passportCall("jwt"), userControllers.current);

export default router;