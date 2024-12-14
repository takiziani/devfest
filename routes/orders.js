import { Router } from "express";
import { Order, Client, Product } from "../sequelize/relation.js";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
dotenv.config();
const router = Router();
router.use(verifyjwt);
// Create a new order by giving it the cid pid quantity
router.post("/orders/create", async (request, response) => {
    try {
        const order = request.body;
        const product = await Product.findOne({ where: { pid: order.pid } });
        if (!product) {
            return response.status(404).json({ error: "Product not found" });
        }
        if (product.stock < order.quantity) {
            return response.status(400).json({ error: "Not enough stock" });
        }
        product.stock -= order.quantity;
        await product.save();
        const neworder = await Order.create(order);
        response.json({ message: "Order created", order: neworder });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// search for a product by name
router.get("/product/search", async (request, response) => {
    try {
        userid = request.userid;
        const query = request.query.name;
        const products = await Product.findAll({
            where: {
                name: {
                    [Op.like]: `%${query}%`
                },
                id_user: userid
            }, attributes: ['pid', 'name'] // Specify the attributes you want to return
        });
        response.json(products);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// search for a client by fullname
router.get("/client/search", async (request, response) => {
    const userid = request.userid;
    const query = request.query.fullname;
    try {
        const clients = await Client.findAll({
            where: {
                fullname: {
                    [Op.like]: `%${query}%`
                },
                id_user: userid
            },
            attributes: ['cid', 'fullname'] // Specify the attributes you want to return
        });
        response.json(clients);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// get the list of orders
router.get("/orders", async (request, response) => {
    try {
        const userid = request.userid;
        const orders = await Order.findAll({ where: { id_user: userid } });
        response.json(orders);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// get the list of orders with details form product and client
router.get("/orders/details", async (request, response) => {
    try {
        const userid = request.userid;
        const orders = await Order.findAll({
            where: { id_user: userid },
            include: [
                {
                    model: Product,
                    attributes: ['pid', 'name', 'price', 'stock']
                },
                {
                    model: Client,
                    attributes: ['cid', 'fullname', 'adress', 'phone']
                }
            ]
        });
        response.json(orders);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// get a order by id
router.get("/orders/:oid", async (request, response) => {
    const oid = request.params.oid;
    const userid = request.userid;
    try {
        const order = await Order.findOne({
            where: {
                oid: oid,
                id_user: userid
            },
            include: [Product, Client]
        });
        if (!order) {
            return response.status(404).json({ error: "Order not found" });
        }
        response.json(order);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// update the order status rate confirmation hour by id 
router.patch("/orders/update/:oid", async (request, response) => {
    const oid = request.params.oid;
    const userid = request.userid;
    const order = request.body;
    try {
        const updatedorder = await Order.findOne({
            where: {
                oid: oid,
                id_user: userid
            }
        });
        if (!updatedorder) {
            return response.status(403).json({ error: "Order not found" });
        }
        if (order.status === 'returned') {
            const product = await Product.findOne({ where: { pid: updatedorder.pid } });
            product.stock += updatedorder.quantity;
            await product.save();
        }
        updatedorder.status = order.status;
        if (updatedorder[0] === 0) {
            return response.status(403).json({ error: "Order not found" });
        }
        response.json({ message: "Order updated" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// delete the order by id
router.delete("/orders/delete/:oid", async (request, response) => {
    try {
        const oid = request.params.oid;
        const userid = request.userid;
        const deletedorder = await Order.destroy({ where: { oid: oid, id_user: userid } });
        if (deletedorder === 0) {
            return response.status(403).json({ error: "Order not found" });
        }
        response.json({ message: "Order deleted" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
export default router;