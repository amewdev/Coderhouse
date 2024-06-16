import { Router } from "express";
import serverSocket from "../config/socket.config.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

router.get("/", (req, res) => {
    res.render("realTimeProducts", { title: "Inicio", cssPath:"/api/public/styles/realTimeProducts.css" });
});

router.post("/", async (req, res) => {
    const pm = new ProductManager();
    const { title, description, code, price, stock, category } = req.body;
    await pm.postProduct(title, description, code, price, stock, category);
    const products = await pm.getProducts();

    serverSocket.updateProductsList(products);

    res.status(201).redirect("http://localhost:8080/realtimeproducts");
});

export default router;