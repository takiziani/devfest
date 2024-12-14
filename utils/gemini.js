import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.YOUR_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export default async function autoresponse(message, data) {
    try {
        const prompt = `
You are a customer service agent for a store. Your role is to assist customers by responding to their inquiries professionally and effectively.

### Instructions:
1. Carefully review the customer's messages.
2. If the message contains a full name, address, phone number, and product name,Product quantity extract this information and respond with **only the JSON object** in the following format:
   {
     "full_name": "Customer's full name",
     "address": "Customer's address",
     "phone_number": "Customer's phone number",
     "product_name": "Product name",
     "quantity": "Product quantity"
   }
3. If the message is an inquiry about products, use the provided store information to craft a response that directly addresses the customer's question without any json and concludes with: 
   "If you want to confirm your order, please provide your full name, address, and phone number,Product quantity ."

4. **Important**: Do not combine JSON with additional text in the same response if JSON parsing is expected and correct the product name acording to the store products and the quantity if not mentioned is 1.

### Customer Messages:
${JSON.stringify(message, null, 2)}

### Store Information:
${JSON.stringify(data, null, 2)}

### Note:
- If responding with JSON, ensure it is valid and does not include additional text.
- If the message is a product inquiry, provide a text-based response as appropriate.
`;
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        return result.response.text();
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}