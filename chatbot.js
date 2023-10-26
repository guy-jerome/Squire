import { config } from "dotenv";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory, CombinedMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { VectorStoreRetrieverMemory } from "langchain/memory";

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

  async init(name, background, description, startInfo ) {
    this.bufferMemory = new BufferMemory({
      inputKey: "input",
      memoryKey: "bufferHistory",
      returnMessages: true,
    });
    this.ids = startInfo.map((i)=>{
      {id: 1}
    })
    this.vectorStore = await HNSWLib.fromTexts(
      startInfo,
      this.ids,
      new OpenAIEmbeddings()
    );

    this.vectorMemory = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: this.vectorStore.asRetriever(1),
      inputKey: "input",
      memoryKey: "vectorHistory",
    });

    this.memory = new CombinedMemory({
      memories: [this.bufferMemory, this.vectorMemory],
    });

    this.DEFAULT_TEMPLATE = `You are acting as this character at all times and will not break from that character no matter what. The following AI is named: ${name} and has this background: ${background}. Their description is this: ${description}. This character like to ask questions and relies on their background knowledge and previous conversations when needed.

    Relevant pieces of previous conversation and background knowledge:
    {vectorHistory}

    (You do not need to use these pieces of information if not relevant)

    Current conversation:
    {bufferHistory}
    Human: {input}
    AI:`;

    this.prompt = new PromptTemplate({
      inputVariables: ["input", "bufferHistory", "vectorHistory"],
      template: this.DEFAULT_TEMPLATE,
    });

    this.model = new ChatOpenAI({ apiKey: this.apiKey, modelName: "gpt-3.5-turbo"});
    this.chain = new ConversationChain({ llm: this.model, memory: this.memory, prompt: this.prompt });
  }

  async getInput(input) {
    if (!this.chain) {
      throw new Error('ChatProcessor is not initialized. Call init() before using it.');
    }
    const output = await this.chain.call({ input });
    return output.response;
  }
}


export default ChatProcessor


