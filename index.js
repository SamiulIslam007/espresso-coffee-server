//  express
const express = require("express");
const cors = require("cors");

// mongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// dotenv
require("dotenv").config();

// calling app with express
const app = express();

// port
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Coffee server is running...");
});

//  connecting mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3qhe6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server
    await client.connect();

    // selecting the coffee collection
    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    // This is the collection for the registered users
    const userColllection = client.db("coffeeDB").collection("users");
    // Showing all the coffee
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const data = await cursor.toArray();

      res.send(data);
    });

    // getting a single coffee data
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // inserting a coffee
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);

      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // updating coffee data
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const updateDoc = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
        },
      };

      const result = await coffeeCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // deleting a coffee
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Registered Users related apis

    // inserting a user to the database
    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await userColllection.insertOne(user);
      res.send(result);
    });
    // Get all users
    app.get("/users", async (req, res) => {
      const cursor = userColllection.find();
      const users = await cursor.toArray();
      res.send(users);
    });
    // Get a single user
    app.get("/users/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await userColllection.findOne(query);
      res.send(result);
    });

    // Deleting a user
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userColllection.deleteOne(query);
      res.send(result);
    });
    // Patch request
    app.patch("/users", async (req, res) => {
      const userInfo = req.body;
      const filter = { email: userInfo.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          lastLoggedAt: userInfo.lastLoggedAt,
        },
      };
      const result = await userColllection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// listening the app
app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`);
});
