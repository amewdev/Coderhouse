import { Router } from "express";
//import CartsManager from "../managers/CartsManager.js";

//import serverSocket from "../config/socket.config.js";

const router = Router();
//const cartsManager = new CartsManager();

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        res.status(200).render("cart", { title: "Cart "+cid, cid, css: "cart.css" });
    } catch (error) {
        res.status(500).send(`<h1>Error 500</h1><h3>${error.message}</h3>`);
    }
});

export default router;