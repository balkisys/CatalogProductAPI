const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const fs = require("fs");
var corsOptions = {
  origin: "http://localhost:8081",
};
const db = require("./models");
const { products } = require("./models");
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route

// set port, listen for requests
require("./routes/product.routes")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const getProducts = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

// with then() *******************************************
//Get products from API and save it in the database
// getProducts("https://tech.dev.ats-digital.com/api/products?size=500")
//   .then((result) => result)
//   .then((result) =>
//     db.products.collection.insertMany(result.products, function (err, res) {
//       if (err) console.log(err);
//       console.log(res + " document(s) updated");
//     })
//   );

// ****************************with async /await *******************
// //IMPORT DATA INTO DB
// let isImported = false
//  const importData = async () => {
//    try {
//        const result = await getProducts(
//          "https://tech.dev.ats-digital.com/api/products?size=500"
//        );
//      await db.products.collection.insertMany(result.products);
//      console.log("Data successfully loaded")
     
//    } catch (error) {
//      isImported = true
//          console.log(error)
//      }
// }
//  console.log('alaaaaaaaaaah',isImported)
//  !isImported && importData()

// inserting data to the user collection database
mongoose.connection.once("open", async () => {
  if ((await products.countDocuments().exec()) > 0)
    return console.log("products already inserted to database");

  getProducts("https://tech.dev.ats-digital.com/api/products?size=500")
    .then((result) => result)
    .then((result) =>
      db.products.create(result.products, function (err, res) {
        if (err) console.log(err);
        console.log(res + " document(s) updated");
      })
    )
    .then(() => console.log("Added products to database"))
    .catch(() => console.log("error occured while inserting data to database"));
});


//READ JSON FILE
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/api/products?size=500`, "utf-8")
// );

// //IMPORT DATA INTO DB
// const importData = async () => {
//     try {
//         await products.create(tours);
//         console.log("Data successfully loaded")
//     } catch (error) {
//         console.log(error)
//     }
// }
// importData()