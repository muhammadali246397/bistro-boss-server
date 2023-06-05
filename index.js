const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.PORT || 4000
require('dotenv').config()


app.use(cors())
app.use(express.json())


app.get('/',(req,res) => {
    res.send('this server is runing')
})




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rfaan6v.mongodb.net/?retryWrites=true&w=majority`;

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
    const foodCollection = client.db('bistro-boss').collection('foodCollection')
    const reviewCollection = client.db('bistro-boss').collection('reviewCollection')
    const cartCollection = client.db('bistro-boss').collection('cartsCollection')
    const userCollection = client.db('bistro-boss').collection('userCollection')
    // Connect the client to the server	(optional starting in v4.7)

    app.post('/user', async(req, res) => {
      const users = req.body;
      console.log(users)
      const query = {email:users.email};
      const existingUser = await userCollection.findOne(query);
      console.log(existingUser)
      if(existingUser){
        return ('allrady use this email')
      }
      const result = await userCollection.insertOne(users);
      res.send(result)
    })

    app.get('/user',async(req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })

      app.get('/menu',async(req,res) => {
        const result = await foodCollection.find().toArray()
        res.send(result);
      })

      app.get('/review',async(req,res) => {
        const result = await reviewCollection.find().toArray()
        res.send(result);
      })

      app.post('/carts', async(req,res) => {
        const item = req.body;
        const result = await cartCollection.insertOne(item);
        res.send(result)
      })
      app.delete('/carts/:id', async(req, res) => {
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result = await cartCollection.deleteOne(query)
        res.send(result)
      })
      app.get('/cart',async(req,res) => {
       const email = req.query.email;
       if(!email){
        res.send([])
       }
       const qurey = {email: email};
       const result = await cartCollection.find(qurey).toArray();
       res.send(result)
       
      })
      

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`server running port on ${port}`)
})