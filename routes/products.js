import { Router } from "express";
import { Product } from "../sequelize/relation.js";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
dotenv.config();
const router = Router();
router.use(verifyjwt);
router.post("/products/create", async (request, response) => {
    try {
        const userid = request.userid;
        // stock price name
        const product = request.body;
        product.id_user = userid;
        const newproduct = await Product.create(product);
        response.json({ message: "Product created", product: newproduct });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/products", async (request, response) => {
    try {
        const products = await Product.findAll();
        response.json(products);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/products/:pid", async (request, response) => {
    const pid = request.params.pid;
    try {
        const product = await Product.findOne({ where: { pid: pid } });
        if (!product) {
            return response.status(404).json({ error: "Product not found" });
        }
        response.json(product);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.patch("/products/update/:pid", async (request, response) => {
    const pid = request.params.pid;
    const userid = request.userid;
    const product = request.body;
    try {
        const updatedproduct = await Product.update(product, { where: { pid: pid, id_user: userid } });
        if (updatedproduct[0] === 0) {
            return response.status(403).json({ error: "Product not found" });
        }
        response.json({ message: "Product updated" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.delete("/products/delete/:pid", async (request, response) => {
    const pid = request.params.pid;
    const userid = request.userid;
    try {
        const deletedproduct = await Product.destroy({ where: { pid: pid, id_user: userid } });
        if (deletedproduct === 0) {
            return response.status(403).json({ error: "Product not found" });
        }
        response.json({ message: "Product deleted" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

export default router;