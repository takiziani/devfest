import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.YOUR_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export default async function autoresponse(message, data) {
    const prompt = `
You are a customer service agent for a store. Below are messages from a customer and details about the store's products. 
Your task:
1. Read the customer's messages.
2. Respond to the customer appropriately and professionally using the provided product information.
### Customer Messages:
${JSON.stringify(message, null, 2)}
### Store Information:
${JSON.stringify(data, null, 2)}
Your reply should be clear, concise, and address the customer's inquiry effectively.
`;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
}