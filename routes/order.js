import { Router } from "express";
import { Order } from "../sequelize/relation.js";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
dotenv.config();
const router = Router();
router.use(verifyjwt);
router.post("/orders/create", async (request, response) => {
    try {
        const userid = request.userid;
        const order = request.body;
        const neworder = await Order.create(order);
        response.json({ message: "Order created", order: neworder });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});