const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fikwith.mongodb.net/?retryWrites=true&w=majority`;

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

    const serviceCollection = client.db("recipeBookDB").collection("services");

    const bookingCollection = client.db("recipeBookDB").collection("bookings");

    const newServiceCollection = client.db("recipeBookDB").collection("newServices");

    // all services
    app.get('/all-services', async(req, res)=>{
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // get a single data
    app.get('/service/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await serviceCollection.findOne(query);
      res.send(result)
    })


    // insert a booking service
    app.post('/bookings', async(req, res)=>{
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
       res.send(result);
    })

    // all booking
    app.get('/bookings', async(req, res)=>{
      const cursor = bookingCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })




    // add a newService api
    app.post('/news-services', async(req, res)=>{
      const newService = req.body;
      const result = await newServiceCollection.insertOne(newService);
      res.send(result)
    })

      //  get all newServices
      app.get('/news-services', async(req, res)=>{
        const cursor = newServiceCollection.find();
        const result = await cursor.toArray();
        res.send(result)
      })

      // get a single service for update
      app.get('/news-services/:id', async(req, res)=>{
        const id = req.params.id;
        const query ={_id: new ObjectId(id)};
        const result = await newServiceCollection.findOne(query);
        res.send(result);
      })

      // update a Service
      app.patch('/news-services/:id', async(req, res)=>{
          const updateService = req.body;
          const id = req.params.id;
          const filter = {_id: new ObjectId(id)};
          const options ={upsert: true}
          const updateDoc ={
            $set:{
            serviceName: updateService.serviceName,
            serviceImage: updateService.serviceImage,
            price : updateService.price,
            area: updateService.area,
            description: updateService.description
            }
          }

          const result = await newServiceCollection.updateOne(filter,updateDoc,options);
          res.send(result);

      })

      // delete a service
      app.delete('/news-services/:id', async(req, res)=>{
        const id = req.params.id;
        const query ={_id: new ObjectId(id)};
        const result = await newServiceCollection.deleteOne(query);
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


app.get('/', (req, res) => {
  res.send('Off recipe book is running')
})

app.listen(port, () => {
  console.log(`Off recipe book is running on port ${port}`)
})