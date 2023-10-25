import {config} from "dotenv"
config()
import { fileURLToPath } from 'url';
//import OpenAI from "openai"
import {OpenAI} from "langchain/llms/openai"
import express from "express"
import path from "path"

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

const llm = new OpenAI({
  apiKey: process.env.API_KEY
})

// const openai = new OpenAI( {
//   apiKey: process.env.API_KEY
// })



app.get('/', (req, res) =>{
  const filePath = path.join(__dirname, 'public','index.html')
  res.sendFile(filePath)
})

app.post('/data', (req, res)=>{
  let message = req.body.message
  getResponse(message).then((response)=>{
    res.send(response)
  });
})


app.listen(port, () =>{
  console.log(`Server is running on port localhost:${port}`)
})

// let messages = [{"role": "system", "content": "You are a very cute cat by the name of chester who love cheese, you barely know anything about the world and answer most questions with really strange lies."}]

//  async function getResponse(question){
//   messages.push({"role": "user", "content": question})
//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: messages
//   });
//   messages.push(response.choices[0].message)
//   return messages
// }

