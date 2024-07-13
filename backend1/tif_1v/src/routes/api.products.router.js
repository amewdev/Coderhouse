import { Router } from "express";
import ProductsManager from "../managers/ProductsManager.js";
import serverSocket from "../config/socket.config.js";
import { getFilters } from "../utils/filters.js";

const router = Router();
const productsManager = new ProductsManager();

router.get("/", async (req, res) => {
    try {
        const products = await productsManager.getAll(req.query);
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await productsManager.getOne(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await productsManager.insertOne(req.body);
        const filters = getFilters();
        serverSocket.updateCategories();
        serverSocket.updateProducts(filters);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await productsManager.updateOne(req.params.id, req.body);

        serverSocket.updateProduct(updatedProduct);

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await productsManager.deleteOne(req.params.id);
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;