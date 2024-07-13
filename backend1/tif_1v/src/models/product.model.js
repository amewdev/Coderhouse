import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: {
        type: String,
        required: [ true, "Product must have a title" ],
    },
    description: {
        type: String,
        required: [ true, "Product must have a description" ],
    },
    code: {
        type: String,
        required: [ true, "Product must have a code" ],
    },
    price: {
        type: Number,
        required: [ true, "Product must have a price" ],
        min: [ 0, "Price must be a number bigger than zero" ],
    },
    stock: {
        type: Number,
        required: [ true, "Product must have an initial stock" ],
        min: [ 0, "Stock must be greater or equal than zero" ],
        validate: {
            validator: Number.isInteger,
            message: "Stock must be an integer number",
        },
    },
    category: {
        type: String,
        required: [ true, "Product must have a category" ],
    },
    status: {
        type: Boolean,
        default: true,
    },
    carts: [{
        type: Schema.Types.ObjectId,
        ref: "carts",
        default: [],
    }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

productSchema.plugin(paginate);

productSchema.methods.updateStockAndStatus = async function(newStock) {
    try {
        this.stock = newStock;
        this.status = this.stock > 0;

        await this.save();
        return this;
    } catch (error) {
        throw new Error(error.message);
    }
};

const ProductModel = model("products", productSchema);

export default ProductModel;