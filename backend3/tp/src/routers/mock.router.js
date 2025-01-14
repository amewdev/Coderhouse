import * as userController from "../controllers/user.controller.js";
import * as petController from "../controllers/pet.controller.js";
import { Router } from "express";
const router = Router();

router.post("/mockingusers", userController.createUsers);
router.get("/mockingusers", userController.getUsers);
router.post("/mockingpets", petController.createPets);
router.get("/mockingpets", petController.getPets);
router.post("/generateData", userController.createUsers, petController.createPets);

export default router;
