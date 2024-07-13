import { Router } from "express";
import ProductsManager from "../managers/ProductsManager.js";

import { setFilters } from "../utils/filters.js";
import serverSocket from "../config/socket.config.js";

const router = Router();
const productsManager = new ProductsManager();

router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = "", category, status } = req.query;
        const filters = { page, limit, sort };

        if (category) filters.category = category;
        if (status) filters.status = status === "true";

        setFilters(filters);

        const data = await productsManager.getAll(filters);

        if (!Number.isInteger(Number(limit))) throw new Error("limit must be an integer number");

        serverSocket.updateProducts(filters);
        res.status(200).render("products", {
            title: "Products",
            data,
            query: req.query,
            css: "products.css",
        });
    } catch (error) {
        res.status(500).send(`<h1>Error 500</h1><h3>${error.message}</h3>`);
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productsManager.getOne(pid);

        const data = product.toObject ? product.toObject() : product;

        res.status(200).render("product", { title: "Product "+data.title, data, css: "product.css", pid });
    } catch (error) {
        res.status(500).send(`<h1>Error 500</h1><h3>${error.message}</h3>`);
    }
});

export default router;