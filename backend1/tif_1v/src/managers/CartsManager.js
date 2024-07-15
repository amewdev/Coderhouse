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

    getProductsFromCart = async (cid) => {
        try {
            const cart = await this.#cartModel.findById(cid).populate("products.product");
            if (!cart) throw new Error("Cart not found");
            return cart.products;
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
            product.status = product.stock > 0;

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

            // Find the product in the cart
            const productInCartIndex = cart.products.findIndex((p) => p.product.toString() === pid);
            if (productInCartIndex !== -1) {
                const productInCart = cart.products[productInCartIndex];

                productInCart.quantity--;
                product.stock++;
                // Remove the product from the cart if quantity is zero
                if (productInCart.quantity <= 0)cart.products.splice(productInCartIndex, 1);
                // Update the product's status
                product.status = product.stock > 0;
                // Save the updated product and cart
                await product.save({ session });
                await cart.save({ session });
            } else {
                throw new Error("Product not found in cart");
            }
            await session.commitTransaction();
            return cart;
        } catch (error) {
            await session.abortTransaction();
            throw new Error(error.message);
        } finally {
            session.endSession();
        }
    };

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
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const cart = await this.#cartModel.findById(cid).session(session);
            if (!cart) throw new Error("Cart not found");

            const updatedProducts = [];

            for (const p of products) {
                const product = await this.#productModel.findById(p.product).session(session);
                if (!product) throw new Error(`Product not found: ${p.product}`);
                // Find the product in the cart
                const productInCart = cart.products.find((item) => item.product.toString() === p.product);
                // Calculate the difference in quantity
                const previousQuantity = productInCart ? productInCart.quantity : 0;
                const quantityDifference = p.quantity - previousQuantity;
                // Check if there is enough stock for the difference
                if (product.stock < quantityDifference) throw new Error(`Not enough stock for product ID ${p.product}. Available stock: ${product.stock}`);
                // Update product stock
                product.stock -= quantityDifference;
                product.status = product.stock > 0;
                // Update product quantity in cart
                if (productInCart) {
                    productInCart.quantity = p.quantity;
                } else {
                    cart.products.push({ product: p.product, quantity: p.quantity });
                }
                updatedProducts.push(product);
            }
            // Save cart and all modified products
            await cart.save({ session });
            await Promise.all(updatedProducts.map((product) => product.save({ session })));
            await session.commitTransaction();
            return cart;
        } catch (error) {
            await session.abortTransaction();
            throw new Error(error.message);
        } finally {
            session.endSession();
        }
    };

    putProductQuantityInCart = async (cid, pid, quantity) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const cart = await this.#cartModel.findById(cid).session(session);
            if (!cart) throw new Error("Cart not found");

            const product = await this.#productModel.findById(pid).session(session);
            if (!product) throw new Error("Product not found");

            const productInCart = cart.products.find((p) => p.product.toString() === pid);
            if (!productInCart) throw new Error("Product not found in cart");

            // Calculate the difference in quantity
            const quantityDifference = quantity - productInCart.quantity;

            // Check if there is enough stock for the increase in quantity
            if (quantityDifference > 0 && product.stock < quantityDifference) {
                throw new Error(`Not enough stock for product ID ${pid}. Available stock: ${product.stock}`);
            }

            // Update the stock of the product
            product.stock -= quantityDifference;
            product.status = product.stock > 0;

            // Update the product quantity in cart
            productInCart.quantity = quantity;

            // Save the cart and the product
            await Promise.all([
                product.save({ session }),
                cart.save({ session }),
            ]);

            await session.commitTransaction();
            return cart;
        } catch (error) {
            await session.abortTransaction();
            throw new Error(error.message);
        } finally {
            session.endSession();
        }
    };

    getAllCartIds = async () => {
        const carts = await this.#cartModel.find().select("_id");
        return carts.map((cart) => cart._id.toString());
    };
}