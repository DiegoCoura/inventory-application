const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  image: { type: String, required: true},
  quantity: { type: Number, required: true }
});

ProductSchema.virtual("url").get(function(){
  return `/catalog/product/${this._id}`
})

module.exports = mongoose.model("Product", ProductSchema);
