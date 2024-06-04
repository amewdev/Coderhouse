import fs from 'fs';
import path from 'path';

export default class CartManager {
    #cartsPath;
    #productsPath;

    constructor() {
        this.#cartsPath = path.join("src","files","carts.json");
        this.#productsPath = path.join("src","files","products.json");
    };

    readJson = async (file) => {
        const content = await fs.promises.readFile(file,"utf8");
        return JSON.parse(content);
    };

    writeJson = async (content) => {
        const JSONFormatCart = JSON.stringify(content,null,"\t");
        return await fs.promises.writeFile(this.#cartsPath, JSONFormatCart);
    };

    getProducts = async () => {
        return await this.readFile(this.#productsPath) ?? [];
    };

    getCarts = async () => {
        return await this.readFile(this.#cartsPath) ?? [];
    };

    getProductsOfACart = async (cid) => {
        //cid previously validated as a Number object in carts.router.js
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);
        if (cart) {
            return cart.products;
        } else {
            throw new Error("There is not a cart with such Id");
        }
    };
    
    postCart = async () => {
        const carts = await this.getCarts();
        const newCart = {
            id: await this.getId(),
            products: []
        };
        carts.push(newCart);
        await this.writeJson(carts);
    };

    addProductToCart = async (cid, pid) => {
        //cid and pid previously validated as Number objects in carts.router.js
        const products = await this.getProducts();
        const product = products.find(p => p.id === pid);
        if (!product) {throw new Error("There is not a product with such Id")};

        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cid);
        if (cartIndex < 0) {throw new Error("There is not a cart with such Id")};

        const productIndexInCart = carts[cartIndex].products.findIndex(p => p.id === pid);
        if (productIndexInCart >= 0) {
            carts[cartIndex].products[productIndexInCart].quantity++;
        } else {
            const newProduct = { id: pid, quantity: 1 };
            carts[cartIndex].products.push(newProduct);
        };
        await this.writeJson(carts);
    };
    
    async getId() {
        const carts = await this.getCarts();
        return carts.length===0 ? 0 : carts[carts.length-1].id+1;
    };
};