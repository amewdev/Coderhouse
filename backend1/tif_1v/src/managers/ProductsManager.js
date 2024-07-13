import ProductModel from "../models/product.model.js";

export default class ProductsManager {
    #productModel;

    constructor () {
        this.#productModel = ProductModel;
    }

    getAll = async (paramFilters) => {
        try {
            const filters = {};
            if (paramFilters?.category) filters.category = paramFilters.category;
            if (paramFilters?.status !== undefined) filters.status = paramFilters.status;

            const sortOptions = {
                asc: { price: 1 },
                desc: { price: -1 },
            };

            const paginationOptions = {
                limit: parseInt(paramFilters.limit, 10) || 10,
                page: parseInt(paramFilters.page, 10) || 1,
                sort: sortOptions[paramFilters?.sort] || {},
                lean: true,
            };

            const productsFound = await this.#productModel.paginate(filters, paginationOptions);
            return productsFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getCategories = async() => {
        // Gets the diferent unique categories
        return await this.#productModel.distinct("category");
    };

    getOne = async (pid) => {
        try {
            const product = await this.#productModel.findById(pid);
            if (!product) throw new Error("Product not found");
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    insertOne = async (data) => {
        try {
            const createdProduct = new this.#productModel(data);
            createdProduct.status = createdProduct.stock > 0;
            createdProduct.carts = [];

            await createdProduct.save();

            return createdProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    updateOne = async (pid, data) => { //file missing
        try {
            data.status = data.stock > 0;
            const updatedProduct = await this.#productModel.findByIdAndUpdate(pid, data, { new: true });
            if (!updatedProduct) throw new Error("Product not found");
            return updatedProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteOne = async (pid) => {
        try {
            const deletedProduct = await this.#productModel.findByIdAndDelete(pid);
            if (!deletedProduct) throw new Error("Product not found");
            return deletedProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    async updateProductStock(pid, newStock) {
        try {
            const product = await this.#productModel.findById(pid);
            if (!product) throw new Error("Product not found");

            await product.updateStockAndStatus(newStock);
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}