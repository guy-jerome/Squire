import {config} from "dotenv"
config()
import { fileURLToPath } from 'url';
import {OpenAI} from "langchain/llms/openai"
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
  const filePath = path.join(__dirname, 'public','index.html')
  res.sendFile(filePath)
})

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



  chatProcessor.init(data.name, data.background, data.description, data.info).then(()=>{
    res.send("set up complete")})
})

app.post('/data', (req, res)=>{
  let message = req.body.message
  chatProcessor.getInput(message).then((message)=>{res.send(message)})
})

app.listen(port, () =>{
  console.log(`Server is running on port localhost:${port}`)
})



