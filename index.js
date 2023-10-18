const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())






const uri = "mongodb+srv://MahbubTenAssignment:OF56kB4ij7LCSCJ8@cluster0.rhsqxdw.mongodb.net/?retryWrites=true&w=majority";

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
    const brandCollection = client.db('Brands').collection('products')
    const cartCollection = client.db('Brands').collection('cartProducts')

    app.post('/postData', async(req , res) =>{
        const data = req.body;
        const result = await brandCollection.insertOne(data);
        res.send(result)
    })

    app.post('/addToCart', async(req , res) => {
        const data = req.body;
        const result = await cartCollection.insertOne(data);
        res.send(result)
    })

    app.get('/loadCartData', async(req , res) => {
        const result = await cartCollection.find();
        res.send(result)
    })

    app.get('/postData/:brand', async(req , res)=>{
        const brandName = req.params.brand;
        const query = {brand: brandName};
        const result = brandCollection.find(query);
        const resultF = await result.toArray();
        res.send(resultF)
    })

    app.get('/detailsData/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await brandCollection.findOne(query);
        res.send(result)
    })

    app.put('/updateProduct/:id', async(req, res) => {
        const id = req.params.id;
        const update = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set:{
                      name:update.name,
                      photo:update.photo,
                      brand:update.brand,
                      type:update.type,
                      price:update.price,
                      rating:update.rating,
            }
        }

        const result = await brandCollection.updateOne(filter,updateDoc,options);
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



app.get('/', (req , res)=>{
    res.send('App is running on server')
})

app.listen(port, ()=>{
    console.log(`app is running on port : ${port}`);
})