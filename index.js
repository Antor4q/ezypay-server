const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 5000
const jwt = require("jsonwebtoken")

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i8hseoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("ezyPayDB").collection("users")

    app.post("/jwt", async(req,res)=>{
      const email = req.body;
      console.log(process.env.ACCESS_TOKEN)
      const token = jwt.sign(email,process.env.ACCESS_TOKEN,{expiresIn: "5h"})
      res.send(token)
    })

    app.post("/user", async(req,res) => {
        const data = req.body
        const result = await usersCollection.insertOne(data)
        res.send(result)
    })

    app.get("/user", async(req,res) => {
      const phone =  req.body;
     
      console.log(phone)
      const result = await usersCollection.find().toArray()
      res.send(result)
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


app.get("/",(req,res)=>{
    res.send("EzyPay server is running")
})

app.listen(port,()=>{
    console.log(`Ezy pay server is running on port ${port}`)
})