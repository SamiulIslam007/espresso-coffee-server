//  express 
const express = require('express'); 
const cors = require('cors');

// mongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');

// dotenv
require('dotenv').config()


// calling app with express
const app = express();

// port 
const port = process.env.PORT || 5000;  


// middlewares 
app.use(cors());
app.use(express.json());


// routes
app.get('/', (req,res)=>{
  res.send("Coffee server is running...");
})

//  connecting mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3qhe6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// Create a new client and connect to MongoDB
const client = new MongoClient(uri);


async function run() {
  try {
    // Connect the client to the server	  
     await client.connect(); 

    const database = client.db("coffeeDB");
    const coffeeCollection = database.collection("coffee");
    // const result = await coffeeCollection.insertOne({name:"Roktim", age: 19 });

    app.post('/coffee', async(req,res)=>{
       
      const newCoffee = req.body;
      console.log(newCoffee); 

      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
        
       
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// listening the app
app.listen(port, ()=> {
    console.log(`Coffee server is running on port ${port}`);
})
 



