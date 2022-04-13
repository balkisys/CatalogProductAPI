module.exports = (app) => {
  const products = require("../controllers/app.controller.js");
  var router = require("express").Router();
  // Retrieve all Products
  router.get("/", products.findAll);
  // Retrieve a single Product with id
  router.get("/:id", products.findOne);
 
  app.use("/api/products", router);
};
