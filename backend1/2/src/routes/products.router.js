import { Router } from "express";
import serverSocket from "../config/socket.config.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    let { limit } = req.query;

    try {
        let products = await productManager.getProducts();
        if (limit) {
            limit = Number(limit);
            if (isNaN(limit)) {
                throw new Error("Limit must be Number");
            } else {
                products = products.filter((p) => p.id <= limit);
            }
        }
        res.status(200).send({ state: "success", payload:products });
    }
    catch(error) {
        res.status(400).send({ state: "error", error: error.message });
    }
});
router.get("/:pid", async (req, res) => {
    let { pid } = req.params;

    pid = Number(pid);
    try {
        if (isNaN(pid)) {throw new Error("Id must be Number");}
        const product = await productManager.getProductById(pid);
        res.status(200).send({ state: "success", payload: product });
    } catch (error) {
        res.status(404).send({ state: "error", error: error.message });
    }
});

router.post("/", async (req, res) => {
    let { title, description, code, price, stock, category } = req.body;

    price = Number(price);
    stock = Number(stock);

    try {
        if (!title || !description || !code || !price || !stock || !category) {
            res.status(400).send({ state: "error", error: "A required field is missing" });
            return;
        }
        //validation of every field

        //if (typeof title !== 'string') {throw new Error("Title must be String")};
        //if (typeof description !== 'string') {throw new Error("Description must be String")};
        //if (typeof code !== 'string') {throw new Error("Code must be String")};
        if (isNaN(price)) {throw new Error("Price must be Number");}
        if (isNaN(stock)) {throw new Error("Stock must be Number");}
        //if (typeof category !== 'string') {throw new Error("Category must be String")};
        //end of validation

        await productManager.postProduct(title, description, code, price, stock, category);
        serverSocket.updateProductsList( await productManager.getProducts());
        res.status(201).send({ state: "success", message: "Product added successfully" });
    } catch (error) {
        res.status(500).send({ state: "error", message: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    let { pid } = req.params;
    let { property, newValue } = req.body;

    pid = Number(pid);
    if (isNaN(pid)) {throw new Error("Id must be Number");}

    property = property.toLowerCase().replace(/\s+/g, "");
    try {
        if (!property || !newValue) {throw new Error("A required field is missing");}

        if (property === "status") {
            switch (newValue.replace(/\s+/g, "").toLowerCase()) {
            case "true": newValue = true; break;
            case "false": newValue = false; break;
            default: throw new Error("Status must be Boolean");
            }
        } else {
            switch (property) {
            case "id" : throw new Error("Id should not be changed");
            case "price" : if (isNaN(Number(newValue))) {throw new Error("Price must be Number");} break;
            case "stock" : if (isNaN(Number(newValue))) {throw new Error("Stock must be Number");}
            }
        }

        if (property === "price" || property === "stock") {
            await productManager.putProduct(pid, property, Number(newValue));
        } else {
            await productManager.putProduct(pid, property, newValue);
        }

        res.status(200).send({ state: "success", message: "Product updated successfully" });
    } catch (error) {
        res.status(404).send({ state: "error", message: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;

    pid = Number(pid);
    try {
        if (isNaN(pid)) {throw new Error("Id must be Number");}
        await productManager.deleteProduct(pid);
        serverSocket.updateProductsList(await productManager.getProducts());
        res.status(200).send({ state: "success", message: "Product deleted succesfully" });
    } catch (error) {
        res.status(404).send({ state: "error", message: error.message });
    }
});

export default router;