const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gufheyv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("technologyDB").collection("products");

    const productCartCollection = client
      .db("technologyDB")
      .collection("productCart");

    //   get all product
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });
    //   insert product data
    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await productCollection.insertOne(products);
      res.send(result);
    });

    // single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // update product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const options = { upsert: true };

      const filter = { _id: new ObjectId(id) };

      const updatedData = {
        $set: {
          name: data.name,
          brandName: data.brandName,
          productType: data.productType,
          price: data.price,
          sortDescription: data.sortDescription,
          rating: data.rating,
          photo: data.photo
        },
      };
      const result = await productCollection.updateOne(filter, updatedData, options);
      res.send(result);
    })

    /*
    ================== Cart =====================
    */

    //  get cart in myCart page
    app.get("/product/cart", async (req, res) => {
      const result = await productCartCollection.find().toArray();
      res.send(result);
    });

    //   insert product data into cart
    app.post("/product/cart", async (req, res) => {
      const cartProducts = req.body;
      const result = await productCartCollection.insertOne(cartProducts);
      res.send(result);
    });

    // cart product delete
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`App running port ${port}`);
});
