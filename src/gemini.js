import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the client with the API key
const genAI = new GoogleGenerativeAI(API_KEY);

// Export the initialized client for other files to use
export default genAI;