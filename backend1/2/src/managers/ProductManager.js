import fs from "fs";
import path from "path";

export default class ProductManager {
    #cartsPath;
    #productsPath;
    #thumbnailsFolderPath;

    constructor() {
        this.#cartsPath = path.join("src", "files", "carts.json");
        this.#productsPath = path.join("src", "files", "products.json");
        this.#thumbnailsFolderPath = path.join("src", "public", "images", "thumbnails");
    }

    readJson = async (path) => {
        const cont = await fs.promises.readFile(path, "utf8");
        return JSON.parse(cont);
    };

    writeJson = async (content, path) => {
        const JSONFormatProduct = JSON.stringify(content, null, "\t");
        return await fs.promises.writeFile(path, JSONFormatProduct);
    };

    getCarts = async () => {return await this.readJson(this.#cartsPath) ?? [];};

    getProducts = async () => {return await this.readJson(this.#productsPath) ?? [];};

    getProductById = async (pid) => {
        //pid previously validated as a Number object in products.router.js
        const products = await this.getProducts();
        const product = products.find((p) => p.id === pid);
        if (!product) { throw new Error("There is not a product with such Id"); }
        return product;
    };

    postProduct = async (title, description, code, price, stock, category) => {
        //fields previously validated in products.router.js
        const products = await this.getProducts();
        const newProduct = {
            id: await this.getId(),
            title, description, code, price, stock, category,
            status: true,
            thumbnails: [],
        };

        await fs.promises.mkdir(this.#thumbnailsFolderPath+"/"+newProduct.id, { recursive: true });
        products.push(newProduct);
        await this.writeJson(products, this.#productsPath);
    };

    deleteProduct = async (pid) => {
        //pid previously validated as a Number object in products.router.js
        const products = await this.getProducts();
        const productIndex = products.findIndex((p) => p.id === pid);
        if (productIndex >= 0) {
            products.splice(productIndex, 1);
            await this.writeJson(products, this.#productsPath);
        } else {
            throw new Error("There is not a product with such Id");
        }

        //the section below deletes the product also from every cart is in
        const carts = await this.getCarts();
        if (carts) {
            const updatedCarts = carts.map((cart) => {
                if (Array.isArray(cart[products])) {
                    cart[products] = cart[products].filter((p) => p.id !== pid);
                }
                return cart;
            });
            await this.writeJson(updatedCarts, this.#cartsPath);
        }

        //the section below deletes the product's thumbnails folder
        await fs.promises.rm(this.#thumbnailsFolderPath+"/"+pid, { recursive: true });
    };

    putProduct = async (pid, property, newValue) => {
        //parameters previously validated in products.router.js
        const products = await this.getProducts();
        const product = products.find((p) => p.id === pid);
        if (product) {
            if (Object.hasOwn(product, property)) {
                if (property === "thumbnails") { //for adding thumbnails
                    if (!Array.isArray(product.thumbnails)) {
                        product["thumbnails"] = [];
                    }
                    product["thumbnails"].push("..\\" + this.#thumbnailsFolderPath + "\\" + newValue);
                } else { //for modifying any other property
                    product[property] = newValue;
                }
                await this.writeJson(products, this.#productsPath);
            } else {
                throw new Error("That property does not exist");
            }
        } else {
            throw new Error("There is not a product with such Id");
        }
    };

    async getId() {
        const products = await this.getProducts();
        return products.length===0 ? 0 : products[products.length-1].id+1;
    }
}
