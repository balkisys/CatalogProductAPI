module.exports = (mongoose,mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      category: String,
      description: String,
      imageUrl: String,
      price: Number,
      productName: String,
      reviews: Array,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const products = mongoose.model("products", schema);
  return products;
};
