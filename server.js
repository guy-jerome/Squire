import {config} from "dotenv"
config()
import { fileURLToPath } from 'url';
import express from "express"
import path from "path"
import ChatProcessor from "./chatbot.js"
import mongoose from 'mongoose'
import squireSchema from './squireSchema.js'

const Squire = mongoose.model('Squire', squireSchema)

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})

const db = mongoose.connection

//This allows __dirname with using modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create express
const app = express()
//Set up the port
const port = process.env.PORT || 3000;
//Uses the folder static for public files
app.use(express.static(path.join(__dirname, "public")));
//Used with json
app.use(express.json());

const chatProcessor = new ChatProcessor(process.env.OPENAI_API_KEY)

app.get('/', (req, res) =>{
  const filePath = path.join(__dirname, 'public','index','index.html')
  res.sendFile(filePath)
})



app.post('/load', (req, res) => {
  const squireName = req.body.squireName;
 // Assuming you pass the Squire's name in the request body
  // Use Mongoose to find the Squire by its name
  Squire.findOne({ name: squireName })
    .then((squire) => {
      if (!squire) {
        res.status(404).send('Squire not found');
      } else {
        chatProcessor.init(squire.name, squire.background, squire.description, squire.info, false).then(()=>{
          res.send("set up complete")}) // Send the retrieved Squire as a JSON response
      }
    })
    .catch((err) => {
      console.error('Error loading Squire from the database:', err);
      res.status(500).send('Error loading Squire from the database');
    });
});

app.get('/get-all-squires', (req, res) => {
  // Use Mongoose to find all squires in the database
  Squire.find({})
    .then((squires) => {
      res.json(squires); // Send the retrieved squires as a JSON response
    })
    .catch((err) => {
      console.error('Error retrieving squires from the database:', err);
      res.status(500).send('Error retrieving squires from the database');
    });
});


app.post('/create', (req, res) =>{
  let data = req.body

    // Create a new instance of the Character model with the data
    const squire = new Squire({
      name: data.name,
      background: data.background,
      description: data.description,
      info: data.info
    });

    // Save the new instance to the database using promises
    squire.save()
    .then(()=>{
      console.log("Saved to database")
    })
    .catch(err=>{
      console.log("wont save to database", err)
    })



  chatProcessor.init(data.name, data.background, data.description, data.info, true).then(()=>{
    res.send("set up complete")})
})

app.post('/data', (req, res)=>{
  let message = req.body.message
  chatProcessor.getInput(message).then((message)=>{res.json({message:message, name:chatProcessor.name})})
})

app.listen(port, () =>{
  console.log(`Server is running on port localhost:${port}`)
})



