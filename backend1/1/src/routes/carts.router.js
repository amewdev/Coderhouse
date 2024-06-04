import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get('/:cid', async (req, res) => {
    let { cid } = req.params;

    cid = Number(cid);
    try {
        if (isNaN(cid)) {throw new Error ("Id must be Number")}; //validation
        const products = await cartManager.getProductsOfACart(cid);
        res.status(200).send({ state: "success", data: products });
    } catch (error) {
        res.status(404).send({ state: "error", message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        await cartManager.postCart();
        res.status(201).send({ state: "success", message: "Cart created successfully" });
    } catch (error) {
        res.status(500).send({ state: "error", message: error.message });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    let { cid, pid } = req.params;

    cid = Number(cid); pid = Number(pid);
    try {
        if (isNaN(cid) || isNaN(pid)) {throw new Error ("Both ids must be Number")}; //validation
        await cartManager.addProductToCart(cid,pid);
        res.status(201).send({ state: "success", message: "Product added to cart successfully" });
    } catch (error) {
        res.status(404).send({ state: "error", message: error.message });
    }
});

export default router;
