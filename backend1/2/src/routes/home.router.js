import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
    const pm = new ProductManager();
    const p = await pm.getProducts();
    res.render("home", { title: "Home", cssPath:"/api/public/styles/home.css", products: p });
});

export default router;