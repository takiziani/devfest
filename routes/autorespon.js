import { Router } from "express";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
import autoresponse from "../utils/gemini.js";
import { Product } from "../sequelize/relation.js";
import { getMessages, sendMessage } from "../utils/fetcher.js";
dotenv.config();
const router = Router();
router.use(verifyjwt);
const checkMessages = async () => {
    try {
        const data = await Product.findAll({ attributes: ['name', 'price', 'description'] });
        const message = await getMessages();
        if (message) {
            const result = await autoresponse(message, data);
            sendMessage(result)
            console.log({ message: result });
        }
    } catch (error) {
        console.error({ error: error.message });
    }
};
// setInterval(checkMessages, 30000);
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