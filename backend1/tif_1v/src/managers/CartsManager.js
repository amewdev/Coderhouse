import mongoose from "mongoose";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";
import ProductsManager from "./ProductsManager.js";

export default class CartsManager {
    #cartModel;
    #productModel;

    constructor () {
        this.#cartModel = CartModel;
        this.#productModel = ProductModel;
        this.productsManager = new ProductsManager();
    }

    getCartById = async (cid) => {
        try {
            const cart = await this.#cartModel.findById(cid).populate("products.product");
            if (!cart) throw new Error("Cart not found");
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    createCart = async() => {
        try {
            const newCart = new this.#cartModel();
            newCart.products = [];
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    addProductToCart = async (cid, pid, quantity = 1) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const cart = await this.#cartModel.findById(cid).session(session);
            if (!cart) throw new Error("Cart not found");

            const product = await this.#productModel.findById(pid).session(session);
            if (!product) throw new Error("Product not found");

            const productInCart = cart.products.find((p) => p.product.toString() === pid);
            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
                product.carts.push(cid);
            }
            // Verifies if stock out
            if (product.stock === 0) throw new Error("Product stock is depleted");

            // Decrements product's stock
            product.stock -= quantity;

            // Updates product's status
            // If stock = 0 then it's not available
            //This is a not tested last minute change
            //Before there was an usual if anidation with the exact same logic
            product.status = product.stock === 0 ? false : true;

            await cart.save();
            await product.save();
            await session.commitTransaction();
            return cart;
        } catch (error) {
            await session.abortTransaction();
            throw new Error(error.message);
        } finally {
            session.endSession();
        }
    };

    removeProductFromCart = async (cid, pid) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const cart = await this.#cartModel.findById(cid).session(session);
            if (!cart) throw new Error("Cart not found");

            const product = await this.#productModel.findById(pid).session(session);
            if (!product) throw new Error("Product not found");

            cart.products = cart.products.filter((p) => p.product.toString() !== pid);

            // Product's stock "recovers" the units
            const productInCart = cart.products.find((p) => p.product.toString() === pid);
            if (productInCart) product.stock += productInCart.quantity;

            // Updates product's status
            //This is a not tested last minute change exactly as the above one
            product.status = product.stock === 0 ? false : true;

            await product.save();
            await cart.save();
            await session.commitTransaction();
            return cart;
        } catch (error) {
            await session.abortTransaction();
            throw new Error(error.message);
        } finally {
            session.endSession();
        }
    };

    // Método para vaciar un carrito
    clearCart = async (cid) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const cart = await this.#cartModel.findById(cid).session(session);
            if (!cart) throw new Error("Cart not found");

            const productQuantities = cart.products.map((p) => ({
                productId: p.product,
                quantity: p.quantity,
            }));

            cart.products = []; // Vacía el array de productos

            await Promise.all(productQuantities.map(async ({ productId, quantity }) => {
                const product = await this.#productModel.findById(productId).session(session);
                if (product) {
                    product.stock += quantity; // Recuperar el stock
                    product.status = product.stock > 0; // Actualizar el estado del producto
                    product.carts = product.carts.filter((cartId) => cartId.toString() !== cid);
                    await product.save();
                }
            }));

            await cart.save();
            await session.commitTransaction();
            return cart;
        } catch (error) {
            await session.abortTransaction();
            throw new Error(error.message);
        } finally {
            session.endSession();
        }
    };

    putProductsInCart = async (cid, products) => {
        try {
            const cart = await this.#cartModel.findById(cid);
            if (!cart) throw new Error("Cart not found");

            for (const { product, quantity } of products) {
                const productInCart = cart.products.find((p) => p.product.toString() === product);
                if (productInCart) {
                    productInCart.quantity += quantity;
                } else {
                    cart.products.push({ product, quantity });
                }
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    putProductQuantityInCart = async (cid, pid, quantity) => {
        try {
            const cart = await this.#cartModel.findById(cid);
            if (!cart) throw new Error("Cart not found");

            const productInCart = cart.products.find((p) => p.product.toString() === pid);
            if (!productInCart) throw new Error("Product not found in cart");

            productInCart.quantity = Number(quantity);

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getAllCartIds = async () => {
        const carts = await this.#cartModel.find().select("_id"); // Obtener solo los IDs de los carritos
        return carts.map((cart) => cart._id.toString());
    };
}