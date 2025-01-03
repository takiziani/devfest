import { Router } from "express";
import { User } from "../sequelize/relation.js";
import { hashPassword, comparePassword } from "../utils/helper.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
dotenv.config();
const router = Router();
// Create a new user
router.post("/users/register", async (request, response) => {
    try {
        const user = request.body;
        user.password = hashPassword(user.password);
        console.log(user);
        const newuser = await User.create(user);
        response.json({ message: "User created" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// delete the user
router.delete("/users/delete", verifyjwt, async (request, response) => {
    const id = request.userid;
    try {
        await User.destroy({ where: { id_user: id } });
        response.json({ message: `User with id ${id} has been deleted` });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// login the user
router.post("/users/login", async (request, response) => {
    const { login, password } = request.body;

    const user = await User.findOne({
        where: {
            [Op.or]: [
                { email: login },
                { username: login }
            ]
        }
    });
    if (!user) {
        return response.status(404).json({ error: "User not found" });
    }
    const hash = hashPassword(password);
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
        return response.status(400).json({ error: "Invalid password" });
    }
    try {
        const accessToken = jwt.sign({ "id": user.id_user, "role": user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ "id": user.id_user, "role": user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        user.refresh_token = refreshToken;
        await user.save();
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true, // The cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (over HTTPS)
            sameSite: 'None', // Strictly same site
            maxAge: 7 * 24 * 60 * 60 * 1000,// Cookie expiry set to match refreshToken,
        });
        // Send the access token to the client
        response.json({
            user: user.name,
            accessToken
        });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// get the access token based on the refresh token 
router.get("/users/refresh", async (request, response) => {
    try {
        const refreshToken = request.cookies.refreshToken;
        console.log(request.cookies);

        if (!refreshToken) {
            return response.status(401).json({ error: "Refresh token not found" });
        }
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            return response.status(401).json({ error: "Invalid refresh token" });
        }
        const user = await User.findOne({ where: { id_user: payload.id } });
        if (!user || user.refresh_token !== refreshToken) {
            return response.status(401).json({ error: "Invalid refresh token" });
        }
        const accessToken = jwt.sign({ "id": user.id_user, "role": user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        response.json({ user: user.name, accessToken });
    } catch (error) {
        response.status(401).json({ error: error.message });
    }
});
// check the user is logged in or not
router.get("/users/check", verifyjwt, async (request, response) => {
    response.json({ message: "User is logged in", userid: request.userid });
});
// logout the user
router.post("/users/logout", verifyjwt, async (request, response) => {
    try {
        const cookies = request.cookies;
        const user = await User.findOne({ where: { refresh_token: cookies.refreshToken } });
        if (!user) {
            return response.status(401).json({ error: "User not found" });
        }
        user.refreshToken = null;
        await user.save();
        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        response.json({ message: "Logged out" });
    } catch (error) {
        response.status(401).json({ error: error.message });
    }
});
// update the user name email and storename
router.patch("/users/update", verifyjwt, async (request, response) => {
    const id = request.userid;
    const user = request.body;
    const allowedColumns = ["name", "email", "storename"]; // Specify the columns that can be updated
    try {
        // Filter out the properties that are not allowed to be updated
        const updatedUser = Object.keys(user).reduce((acc, key) => {
            if (allowedColumns.includes(key)) {
                acc[key] = user[key];
            }
            return acc;
        }, {});
        await User.update(updatedUser, { where: { id_user: id } });
        response.json({ message: `User with id ${id} has been updated` });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// update the user password
router.patch("/users/updatepassword", verifyjwt, async (request, response) => {
    const id = request.userid;
    try {
        const { oldpassword, newpassword } = request.body;
        const user = await User.findByPk(id);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = comparePassword(oldpassword, user.password);
        if (!isPasswordValid) {
            return response.status(400).json({ error: "Invalid password" });
        }
        const hash = hashPassword(newpassword);
        try {
            user.password = hash;
            await user.save();
            response.json({ message: "Password updated" });
        } catch (error) {
            response.status(400).json({ error: error.message });
        }
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
export default router;