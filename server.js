import {config} from "dotenv"
config()
import { fileURLToPath } from 'url';
import express from "express"
import path from "path"
import ChatProcessor from "./chatbot.js"
import mongoose from 'mongoose'
import squireSchema from './squireSchema.js'

//SET UP DATABASE CONNECTION
const Squire = mongoose.model('Squire', squireSchema)
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection

//GET FILE NAME WORKING WITH ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//INIT EXPRESS
const app = express()
const port = process.env.PORT || 3000;

//MIDDLE WARE
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//SET UP THE CHAT BOT PROCESSOR
const chatProcessor = new ChatProcessor(process.env.OPENAI_API_KEY)


//-------------------------ROUTES---------------------------------

//Sends the main index file
app.get('/', (req, res) =>{
  const filePath = path.join(__dirname, 'public','index','index.html')
  res.sendFile(filePath)
})

//LOADS ONE SQUIRE
app.post('/load', (req, res) => {
  const squireName = req.body.squireName;
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

//LOADS ALL OF THE SQUIRES FROM THE DATABASE
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

//CREATES A SQUIRE
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

    // Sets up the chatProcessor for the squire
    chatProcessor.init(data.name, data.background, data.description, data.info, true).then(()=>{
    res.send("set up complete")})
})

//GET THE RESPONSE FROM THE CHAT PROCESSOR
app.post('/data', (req, res)=>{
  let message = req.body.message
  chatProcessor.getInput(message).then((message)=>{res.json({message:message, name:chatProcessor.name})})
})

//LISTEN ON THE PORT
app.listen(port, () =>{
  console.log(`Server is running on port localhost:${port}`)
})