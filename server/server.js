const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const products = require("./db");
var uuid = require("uuid");
var fs = require("fs");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

http.createServer(app).listen(3001, () => {
  console.log("Listen on 0.0.0.0:3001");
});

app.get("/", (_, res) => {
  res.send({ status: 200 });
});

// Task-1
app.post("/AddProduct", (req, res) => {
  var id = uuid.v1();
  var name = req.body.name;
  var category = req.body.category;
  var price = req.body.price;

  var prod = { id: id, name: name, category: category, price: price };
  products.push(prod);

  var file = fs.createWriteStream("db.js");
  file.write("const products = ");
  file.write(JSON.stringify(products, null, 2), { spaces: 4 });
  file.write("\nmodule.exports = products");
  res.send({ status: 200, msg: "Product Added" });
});

// Task-2
app.get("/GetProducts", (req, res) => {
  var relatedProducts = products;
  var minPrice = parseInt(req.query.minPrice);
  var maxPrice = parseInt(req.query.maxPrice);

  if (req.query.category) {
    relatedProducts = relatedProducts.filter(
      (product) => product.category == req.query.category
    );
  }

  if (maxPrice) {
    relatedProducts = relatedProducts.filter(
      (product) => product.price <= maxPrice
    );
  }
  if (minPrice) {
    relatedProducts = relatedProducts.filter(
      (product) => product.price >= minPrice
    );
  }

  relatedProducts = relatedProducts.slice(0, 24);

  res.send({ status: 200, data: relatedProducts });
});

// Task-3
app.get("/GetProducts/:id", (req, res) => {
 
  var productId = req.params.id;
  var targetProduct = products.find((product) => product.id == productId);
  var targetProductPrice = targetProduct.price;

  // Number of closest Products W.R.T Price
  const N = 5;

  // Contains products along with their price differnce from target product
  var relatedProducts = products
    .filter(
      (product) =>
        product.id != productId && product.category == targetProduct.category
    )
    .map((product) => {
      var priceDifference = Math.abs(product.price - targetProductPrice);
      return {
        ...product,
        priceDifference,
      };
    });

  // Sorting array
  relatedProducts.sort(function (a, b) {
    return a.priceDifference - b.priceDifference;
  });

  // Slicing array to required number of products
  relatedProducts = relatedProducts.slice(0, N);
  
  // Return Products
  res.send({ status: 200, data: relatedProducts });
});
process.on("SIGINT", function () {
  process.exit();
});
