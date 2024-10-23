# PDF-Based Q&A App with LangChain, Next.js, and Google Generative AI

This is a Q&A web application built using Next.js, LangChain, and MongoDB Atlas Vector Search. The app allows users to upload PDFs, processes the documents, and stores their embeddings in a vector database. You can then ask questions about the uploaded PDF, and the app will retrieve relevant information using Google Generative AI.

## Features
- **Upload PDF Documents**: Upload any PDF file to be processed.
- **Document Processing**: Split the PDF into smaller chunks, create embeddings using Google Generative AI, and store them in a MongoDB vector database.
- **Question Answering**: Ask questions about the PDF content, and the app retrieves and generates answers using the vector database and Google Generative AI.

## Tech Stack
- **Next.js**: Frontend framework for building the app.
- **LangChain**: Used to process documents, create embeddings, and set up the vector DB for retrieval.
- **MongoDB Atlas**: Vector search capabilities using MongoDB Atlas to store and retrieve document embeddings.
- **Google Generative AI (Gemini)**: Provides embeddings for vector storage and Q&A capabilities.

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- MongoDB Atlas account (or any MongoDB instance)
- Google Cloud API Key (for Google Generative AI)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pdf-qa-app.git
cd chat-with-pdf
```

### 2. Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### 3. Configure Environment Variables

1. Rename `.env.example` to `.env`:

```bash
mv .env.example .env
```

2. Open the `.env` file and add the required API keys and MongoDB configuration:

```env
MONGODB_ATLAS_URI=your_mongodb_atlas_uri
MONGODB_ATLAS_DB_NAME=your_db_name
MONGODB_ATLAS_COLLECTION_NAME=your_collection_name

GOOGLE_API_KEY=your_google_api_key
```

### 4. Run the Development Server

Once the environment variables are configured, you can start the Next.js development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## How It Works

1. **Uploading PDFs**: Users upload PDFs through a simple UI. The PDF is processed on the server.
2. **Document Splitting**: The PDF is split into smaller chunks using `RecursiveCharacterTextSplitter`.
3. **Embedding Creation**: Google Generative AI creates embeddings for each chunk of the document.
4. **Vector Storage**: Embeddings are stored in MongoDB Atlas, which acts as a vector database for fast retrieval.
5. **Q&A**: Users can ask questions about the PDF. The app retrieves the relevant chunks from the vector database and generates an answer using Google Generative AI.

## Future Improvements
- Implement more advanced chunking techniques for large PDFs.
- Support for other file types (Word, text).
- Add authentication and access control for uploaded documents.
