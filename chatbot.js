import { config } from "dotenv";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory, CombinedMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { VectorStoreRetrieverMemory } from "langchain/memory";


//MAIN CHAT PROCESSOR 
class ChatProcessor {
  constructor(apiKey) {
    config();
    this.apiKey = apiKey;
    this.bufferMemory = null;
    this.vectorStore = null;
    this.vectorMemory = null;
    this.memory = null;
    this.DEFAULT_TEMPLATE = null;
    this.prompt = null;
    this.model = null;
    this.chain = null;

  }
  //THIS IS THE MAIN INIT FUNCTION FOR LOADING/CREATE A CHAT BOT
  async init(name, background, description, startInfo, newSquire ) {
    this.name = name
    this.bufferMemory = new BufferMemory({
      inputKey: "input",
      memoryKey: "bufferHistory",
      returnMessages: true,
    });
    // THIS CREATES A NEW SQUIRE
    if (newSquire){
      this.ids = startInfo.map((i)=>{
        {id: 1}
      })
      this.vectorStore = await HNSWLib.fromTexts(
        startInfo,
        this.ids,
        new OpenAIEmbeddings()
      );
      //MAKES A NEW VECTOR STORE AND INDEX
      this.directory = `./squires/${name}`
      await this.vectorStore.save(this.directory)
    }else{
      //ELSE LOADS OTHER INDEX
      this.directory = `./squires/${name}`
      this.vectorStore =  await HNSWLib.load(this.directory, new OpenAIEmbeddings())
    }

    //CREATES A VECTOR MEMORY
    this.vectorMemory = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: this.vectorStore.asRetriever(2),
      inputKey: "input",
      memoryKey: "vectorHistory",
    });
    //WE ARE WORKING WITH TWO TYPES OF MEMORY BUFFER AND VECTOR
    this.memory = new CombinedMemory({
      memories: [this.bufferMemory, this.vectorMemory],
    });

    //THIS IS THE BASE SQUIRE TEMPLATE
    this.DEFAULT_TEMPLATE = `You are acting as this character at all times and will not break from that character no matter what. The following AI is named: ${name} and has this background: ${background}. Their description is this: ${description}. This character relies on thier memories when possible. You are a medievel squire with absolutly no knowledge of the modern world. Be fun and creative with your personality. Your human conversational partner is your knight to whom your have sweared feality to. Only respond as yourself.

    Relevant pieces of previous conversation and background knowledge:
    {vectorHistory}

    (You do not need to use these pieces of information if not relevant)

    Current conversation:
    {bufferHistory}
    Human: {input}
    AI:`;
    //SAVES THE TEMPLATE INTO THE PROMPT 
    this.prompt = new PromptTemplate({
      inputVariables: ["input", "bufferHistory", "vectorHistory"],
      template: this.DEFAULT_TEMPLATE,
    });

    //CREATES THE MODEL, CHOOSE GTP 3.5-turbo
    this.model = new ChatOpenAI({ apiKey: this.apiKey, modelName: "gpt-3.5-turbo", temperature: 0.9});
    //CREATES THE CHAIN
    this.chain = new ConversationChain({ llm: this.model, memory: this.memory, prompt: this.prompt });
  }
  //QUERIES THE MODEL
  async getInput(input) {
    if (!this.chain) {
      throw new Error('ChatProcessor is not initialized. Call init() before using it.');
    }
    const output = await this.chain.call({ input });
    await this.vectorStore.save(this.directory)
    return output.response;
  }
}

//EXPORT THE CHATPROCESSOR
export default ChatProcessor


