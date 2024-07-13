import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [ 1, "Quantity must be at least 1" ],
            },
        },
    ],
});

cartSchema.pre("findByIdAndDelete", async function(next) {
    const StudentModel = this.model("products");

    await StudentModel.updateMany(
        { carts: this._id },
        { $pull: { carts: this._id } },
    );

    next();
});

cartSchema.plugin(paginate);

const CartModel = model("carts", cartSchema);

export default CartModel;