import path, { join } from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
    RunnablePassthrough,
    RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { Document } from "@langchain/core/documents";

// Global references for vector store and MongoDB client
let vectorStore: MongoDBAtlasVectorSearch | null = null;
const client = new MongoClient(process.env.MONGODB_ATLAS_URI!);

// Function to load and split the PDF (run only once)
async function loadAndSplitPDF(pdfPath: string) {
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 20
    });
    return await splitter.splitDocuments(docs);
}

// Function to create vector store (run only once)
async function createVectorStore(splittedDocs: Document[]) {
    await client.connect();

    const collection = client
        .db(process.env.MONGODB_ATLAS_DB_NAME!)
        .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME!);

    collection.deleteMany({}); // Optional: clear the collection before storing new data

    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
        apiKey: process.env.GOOGLE_API_KEY
    });

    const dbConfig = {
        collection: collection,
        indexName: "vector_index",
        textKey: "text",
        embeddingKey: "embedding",
    };

    vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
        splittedDocs,
        embeddings,
        dbConfig
    );
}

// Function to get the vector store (reuse if it exists)
async function getVectorStore() {
    if (!vectorStore) {
        const pdfPath = join('src', 'temp', 'uploaded.pdf'); // Adjust the path as needed
        const splittedDocs = await loadAndSplitPDF(pdfPath);
        await createVectorStore(splittedDocs);
    }
    return vectorStore;
}

// Function to get an answer based on a question
export async function getAnswer(question: string) {
    const vectorStore = await getVectorStore();
    if (!vectorStore) {
        return "no vector store found"
    }
    const retriever = vectorStore.asRetriever();

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-pro",
        maxRetries: 2,
    });

    const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
    ----------------
    {context}`;

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", SYSTEM_TEMPLATE],
        ["human", "{question}"],
    ]);

    const chain = RunnableSequence.from([
        {
            context: retriever,
            question: new RunnablePassthrough(),
        },
        prompt,
        model,
        new StringOutputParser(),
    ]);

    const answer = await chain.invoke(question);
    return answer;
}
