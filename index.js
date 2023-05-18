const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const PORT = process.env.PORT || 5000;
require("dotenv").config();



app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@simple-crud-2023.h8uagaz.mongodb.net/?retryWrites=true&w=majority`;

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
     
    const toysCollection = client.db("toy-castle").collection("toys")
    
    //post toy to the database
    app.post('/toys' , async (req,res) => {
        const data = req.body;
        const result = await toysCollection.insertOne(data)
        res.send(result)
    })

      
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
     
  }
}
run().catch(console.dir);










app.get("/",(req,res) => {
    res.send("i am running")
})


app.listen(PORT , () => {
    console.log(`server is running on port ${PORT}`)
})