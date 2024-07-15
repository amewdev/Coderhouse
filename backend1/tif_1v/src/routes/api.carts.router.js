import { Router } from "express";
import serverSocket from "../config/socket.config.js";
import CartsManager from "../managers/CartsManager.js";
import ProductsManager from "../managers/ProductsManager.js";
import { getFilters } from "../utils/filters.js";

const router = Router();
const cartsManager = new CartsManager();
const productsManager = new ProductsManager();

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsManager.getCartById(cid);
        res.status(200).json({ status: true, payload: cart });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await cartsManager.createCart();
        serverSocket.updateCarts();
        res.status(201).json({ status: true, payload: newCart });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartUpdated = await cartsManager.addProductToCart(cid, pid);
        const filters = getFilters();
        serverSocket.updateProducts(filters);

        serverSocket.updateCart(cid);
        const product = await productsManager.getOne(pid);
        serverSocket.updateProduct(product);
        res.status(201).json({ status: true, payload: cartUpdated });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cartUpdated = await cartsManager.removeProductFromCart(cid, pid);

        const filters = getFilters();
        serverSocket.updateProducts(filters);

        const product = await productsManager.getOne(pid);
        serverSocket.updateProduct(product);

        serverSocket.updateCart(cid);

        res.status(200).json({ status: true, payload: cartUpdated });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cartCleared = await cartsManager.clearCart(cid);

        const filters = getFilters();
        serverSocket.updateProducts(filters);

        serverSocket.updateCart(cid);

        res.status(200).json({ status: true, payload: cartCleared });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        /*
        REQ BODY FORMAT
        {
            "products": [
                { "product": "id_product_1", "quantity": quantity_product_1 },
                { "product": "id_product_2", "quantity": quantity_product_2 },
                ...
                { "product": "id_product_n", "quantity": quantity_product_n },
            ]
        }
        */
        if (!products) return res.status(400).json({ status: false, message: "Input should be an object with an unique property called 'products' equal to an array of objects each one with only two properties called 'product' and 'quantity'" });
        if (!Array.isArray(products)) return res.status(400).json({ status: false, message: "Input should be an array of objects called 'products' with each one with only two properties called 'product' and 'quantity'" });

        for (const p of products) {
            if (!p.product) return res.status(400).json({ status: false, message: "Each product should have a 'product' property" });

            if (typeof p.quantity !== "number") p.quantity = Number(p.quantity);
            if (!p.quantity) return res.status(400).json({ status: false, message: "Each product should have a 'quantity' property" });
            if (p.quantity <= 0 || !Number.isInteger(p.quantity)) return res.status(400).json({ status: false, message: "Quantities must be integer numbers bigger than zero" });

            const product = await productsManager.getOne(p.product);
            //Verify product exists
            if (!product) return res.status(404).json({ status: false, message: `There is not a product with ID ${p.product}` });
            //Verify if there is enough stock
            //if (product.stock < p.quantity) return res.status(400).json({ status: false, message: `Not enough stock for product ID ${p.product}. Available stock: ${product.stock}` });
        }
        const cartUpdated = await cartsManager.putProductsInCart(cid, products);

        const filters = getFilters();
        serverSocket.updateProducts(filters);

        serverSocket.updateCart(cid);

        res.status(200).json({ status: true, payload: cartUpdated });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        /*
        REQ BODY FORMAT
        {
            "quantity": quantity
        }
        */
        if (typeof quantity !== "number") return res.status(400).json({ status: false, message: "Quantity must be a number (write number without quotes)" });
        if (quantity <= 0 || !Number.isInteger(quantity)) return res.status(400).json({ status: false, message: "Quantity must be an integer number greater than zero" });

        const product = await productsManager.getOne(pid);
        if (!product) return res.status(404).json({ status: false, message: `Product with ID ${pid} not found` });
        //if (product.stock < quantity) return res.status(400).json({ status: false, message: `Not enough stock for product ID ${pid}. Available stock: ${product.stock}` });

        const cartUpdated = await cartsManager.putProductQuantityInCart(cid, pid, quantity);

        const filters = getFilters();
        serverSocket.updateProducts(filters);

        serverSocket.updateCart(cid);

        res.status(200).json({ status: true, payload: cartUpdated });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

export default router;