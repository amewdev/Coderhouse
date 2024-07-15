import { Router } from "express";
import ProductsManager from "../managers/ProductsManager.js";
import serverSocket from "../config/socket.config.js";
import { getFilters } from "../utils/filters.js";

const router = Router();
const productsManager = new ProductsManager();

router.get("/", async (req, res) => {
    try {
        const { page, limit, sort, category, status } = req.query;

        const filters = {};
        filters.page = page ? Number(page) : 1;
        filters.limit = limit || 10;
        if (sort==="asc" || sort==="desc") filters.sort = sort;
        if (category) filters.category = category;
        if (status) filters.status = status;

        const productsResult = await productsManager.getAll(filters);

        let prevUrl = `localhost:8080/products?page=${filters.page-1}&limit=${limit}`;
        let nextUrl = `localhost:8080/products?page=${filters.page+1}&limit=${limit}`;
        if (sort) {
            prevUrl += `&sort=${sort}`;
            nextUrl += `&sort=${sort}`;
        }
        if (category) {
            prevUrl += `&category=${category}`;
            nextUrl += `&category=${category}`;
        }
        if (status) {
            prevUrl += `&status=${status}`;
            nextUrl += `&status=${status}`;
        }
        const response = {
            status: "success",
            payload: productsResult.docs,
            totalPages: productsResult.totalPages,
            prevPage: productsResult.prevPage || null,
            nextPage: productsResult.nextPage || null,
            page: productsResult.page,
            hasPrevPage: productsResult.hasPrevPage,
            hasNextPage: productsResult.hasNextPage,
            prevLink: productsResult.hasPrevPage ? prevUrl : null,
            nextLink: productsResult.hasNextPage ? nextUrl : null,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
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