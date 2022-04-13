const db = require("../models");
const Product = db.products;
// Methode to calculate the average of product scores
const calculateAverage = (array) => {
  var sum = 0;

  for (var i = 0; i < array.length; i++) {
    sum += parseInt(array[i], 10);
  }
  return sum / array.length;
};
// Product with pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
// Get All products with filter
exports.findAll = (req, res) => {
  const { page, size } = req.query;

  const { limit, offset } = getPagination(page, size);
  var filter = {};
  if (req.query.category)
    filter.category = { $regex: new RegExp(req.query.category), $options: "i" };
  if (req.query.price) filter.price = { $gt: req.query.price };

  if (req.query.productName) {
    filter.productName = {
      $regex: new RegExp(req.query.productName),
      $options: "i",
    };
  }

  Product.paginate(filter, { offset, limit })
    .then((data) => {
      const costumData = data.docs.map((v) => ({
        category: v.category,
        productName: v.productName,
        price: v.price,
        imageUrl: v.imageUrl,
        averageScore: calculateAverage(v.reviews.map((e) => e.value)),
        id: v.id,
      }));

      res.set("Access-Control-Allow-Origin", "*");
      res.send({
        totalItems: data.totalDocs,
        products: costumData,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products.",
      });
    });
};

// Find a single Product with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .then((data) => {
      const costumData = {
        category: data.category,
        productName: data.productName,
        price: data.price,
        imageUrl: data.imageUrl,
        description: data.description,
        averageScore: calculateAverage(data.reviews.map((e) => e.value)),
        reviews: data.reviews,
        id,
      };
      res.set("Access-Control-Allow-Origin", "*");
      res.send(costumData);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Product with id=" + id });
    });
};
