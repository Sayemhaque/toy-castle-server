const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const PORT = process.env.PORT || 5000;
require("dotenv").config();


app.use(cors());
app.use(express.json());




// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@simple-crud-2023.h8uagaz.mongodb.net/?retryWrites=true&w=majority`;
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
      //client.connect();
    const toysCollection = client.db("toy-castle").collection("toys")
    const galleryCollection = client.db("toy-castle").collection("gallery")
    const exclusiveCollection = client.db("toy-castle").collection("exclusive-toys")
    const placeCollection = client.db("toy-castle").collection("places")

    const indexKeys = { toyName: 1, };
    const indexOptions = { name: "toyName" };
    const result = await toysCollection.createIndex(indexKeys, indexOptions);
    console.log(result)

    

    //post toy to the database
    app.post('/toys', async (req, res) => {
      const data = req.body;
      const result = await toysCollection.insertOne(data)
      res.send(result)
    })

    //get all toys
    app.get('/alltoys', async (req, res) => {
      const result = await toysCollection.find().limit(20).toArray()
      res.send(result)
    })

    // get my toys
    app.get('/mytoys/:email', async (req, res) => {
      const email = req.params.email;
      const result = await toysCollection.find({sellerEmail:email}).toArray()
      res.send(result)
    })

     // sort toy by price
     // low to high
     app.get('/lowest/:email' , async (req,res) => {
      const email = req.params.email;
      const result = await toysCollection.find({sellerEmail:email}).sort({price: 1}).toArray()
      res.send(result)
     })
      
     // high to low
     app.get('/highest/:email' , async (req,res) => {
      const email = req.params.email;
      const result = await toysCollection.find({sellerEmail:email}).sort({price: -1}).toArray()
      res.send(result)
     })


    //get single toy
    app.get('/toydetail/:id', async (req, res) => {
      const id = req.params.id;
      const result = await toysCollection.findOne({ _id: new ObjectId(id) })
      res.send(result)
    })



    //search toys 
    app.get('/search/:toyName', async (req, res) => {
      const searchText = req.params.toyName;
      console.log(searchText)
      const result = await toysCollection.find(
        { toyName: { $regex: searchText, $options: "i" } }).toArray()
      res.send(result)

    })



    //  get toys by sub category
    app.get('/toys/category/:subCategroy', async (req, res) => {
      const result = await toysCollection.find({
        subCategory: req.params.subCategroy
      }).toArray()
      res.send(result)
    })



    //get gallery photo
    app.get('/gallery', async (req, res) => {
      const result = await galleryCollection.find().toArray()
      res.send(result)
    })



    //get exclusive toys
    app.get('/exclusive', async (req, res) => {
      const result = await exclusiveCollection.find().toArray()
      res.send(result)
    })

    //update a toy
    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const update = {
        $set: {
          photoUrl: data.photoUrl,
          toyName: data.toyName,
          rating: data.rating,
          price: data.price,
          quantity: data.quantity,
          description: data.description,
        }
      }
      const result = await toysCollection.updateOne({_id: new ObjectId(id)},update)
      res.send(result)
    })



    //delete a toy
    app.delete('/toy/delete/:id' ,  async (req,res) => {
      const id = req.params.id;
      const result = await toysCollection.deleteOne({_id: new ObjectId(id)})
      res.send(result);
    })



    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);










app.get("/", (req, res) => {
  res.send("i am running")
})


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})