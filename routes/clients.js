import { Router } from "express";
import { Client } from "../sequelize/relation.js";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
dotenv.config();
const router = Router();
router.use(verifyjwt);
// create a new client
router.post("/clients/create", async (request, response) => {
    try {
        const userid = request.userid;
        const client = request.body;
        client.id_user = userid;
        const newclient = await Client.create(client);
        response.json({ message: "Client created", client: newclient });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// get the list of clients
router.get("/clients", async (request, response) => {
    try {
        const userid = request.userid;
        const clients = await Client.findAll({ where: { id_user: userid } });
        response.json(clients);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// get a client by id
router.get("/clients/:cid", async (request, response) => {
    const cid = request.params.cid;
    const userid = request.userid;
    try {
        const client = await Client.findOne({ where: { cid: cid, id_user: userid } });
        if (!client) {
            return response.status(404).json({ error: "Client not found" });
        }
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// update the client fullname adress phone number by id 
router.patch("/clients/update/:cid", async (request, response) => {
    const cid = request.params.cid;
    const userid = request.userid;
    const client = request.body;
    try {
        const updatedclient = await Client.update(client, { where: { cid: cid, id_user: userid } });
        if (!updatedclient) {
            return response.status(403).json({ error: "Client not found" });
        }
        response.json({ message: "Client updated" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// delete the client by id
router.delete("/clients/delete/:cid", async (request, response) => {
    const cid = request.params.cid;
    const userid = request.userid;
    try {
        const deletedclient = await Client.destroy({ where: { cid: cid, id_user: userid } });
        if (deletedclient === 0) {
            return response.status(403).json({ error: "Client not found" });
        }
        response.json({ message: "Client deleted" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
export default router;