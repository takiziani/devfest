import { Router } from "express";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
import autoresponse from "../utils/gemini.js";
import { Product, Client, Order } from "../sequelize/relation.js";
import { getMessages, sendMessage } from "../utils/fetcher.js";
dotenv.config();
const router = Router();
router.use(verifyjwt);
const checkMessages = async () => {
    const message = await getMessages();
    // console.log(JSON.stringify(message));
    if (message.data[0].messages.data[0].from.name != "مكتبة زياني") {
        const data = await Product.findAll({ attributes: ['name', 'price', 'description'] });
        const result = await autoresponse(message, data);
        // Ensure result is a valid JSON string
        try {
            // Remove unwanted characters and log the cleaned result
            const cleanedResult = result.replace(/(\r\n|\n|\r)/gm, "").replace(/```json|```/g, "").replace(/`/g, "");
            console.log(cleanedResult); // Log the cleaned result to see its content
            const resultjson = JSON.parse(cleanedResult);
            if (resultjson = {}) {
                sendMessage("sorry i am not trainet to handel this question")
            }
            if (resultjson.full_name && resultjson.address && resultjson.phone_number && resultjson.product_name && resultjson.quantity) {
                const isthere = await Client.findOne({ where: { phone: resultjson.phone_number } });
                if (isthere) {
                    console.log({ message: "Client found" });

                    const product = await Product.findOne({ where: { name: resultjson.product_name } });
                    if (!product) {
                        console.error("Product not found");
                        return;
                    }
                    const order = await Order.create({
                        id_product: product.pid,
                        id_client: isthere.cid,
                        quantity: resultjson.quantity
                    });
                    sendMessage("Order created");
                } else {
                    const client = await Client.create({
                        fullname: resultjson.full_name,
                        adress: resultjson.address,
                        phone: resultjson.phone_number,
                    });
                    console.log({ message: "Client created", client: client });
                    const product = await Product.findOne({ where: { name: resultjson.product_name } });
                    if (!product) {
                        console.error("Product not found");
                        return;
                    }
                    const order = await Order.create({
                        id_product: product.pid,
                        id_client: client.cid,
                        quantity: resultjson.quantity
                    });
                    sendMessage("Order created");
                }
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            sendMessage(result)
        }
    }
};
setInterval(checkMessages, 10000);
router.get("/autoresponse", async (request, response) => {
    try {
        const id_user = request.userid;
        const products = await Product.findAll({
            where: { id_user: id_user },
            attributes: ['name', 'price', 'description']
        });
        const data = products.map(product => product.dataValues);
        const dataText = data.map(product => `Name: ${product.name}, Price: ${product.price}, Description: ${product.description}`).join('\n');
        console.log(dataText);
        const messages = await getMessages();
        console.log("messages " + messages.data[0]);
        const result = await autoresponse(messages.data[0], dataText);
        sendMessage(result)
        response.json({ message: result });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
export default router;