# Squire

## A RAG Retrieval-Augmented Question-Answering Chat Assistant 


Squire is a full-stack web application that functions as an intelligent chat assistant, leveraging the power of the OPENAI API, in-memory vector database (hnswlib-node), and MongoDB for persistent memory. 


## Key Features

* Retrieval-Augmented Generation (RAG): Squire utilizes RAG to retrieve relevant information from its databases, improving the accuracy and context of its responses.

* Persistent Memory: Enhanced by MongoDB, Squire can recall information from past conversations and tailor its responses based on user history.

* Vector Search: The in-memory vector database (hnswlib-node) allows Squire to efficiently search through vast amounts of data for relevant information.

## Technology Stack

Frontend: Vanilla.js 
Backend: Express.js
Databases:
* MongoDB (for persistent storage)
* hnswlib-node (for vector search)

API: OPENAI API

## Setup

Clone the repository:

* git clone https://github.com/guy-jerome/Squire.git

Install dependencies:

* cd frontend-project
* npm install

Create a .env file (using .env.template as a guide) and add your environment variables:

* OPENAI_API_KEY: Your API key from OpenAI.
* DATABASE_URL: Your MongoDB connection string.
Start the development server:

npm run dev

## Usage

Open your web browser and navigate to the provided server address (e.g., http://localhost:3000).
Interact with Squire through the chat interface. Ask questions and engage in conversation to experience its intelligent and medival responses. Your squire will remember past conversations and all implanted memories.

## Contributing

We welcome contributions to Squire! Feel free to fork the repository, make improvements, and submit pull requests.


## License

Squire is licensed under the MIT license.
