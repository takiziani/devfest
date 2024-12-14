import { Router } from "express";
import usersRouter from './users.js';
import productsRouter from './products.js';
import clientsRouter from './clients.js';
import ordersRouter from './orders.js';
import qrcodeRouter from './qrcode.js';
import yalidineRouter from './yalidine.js';

// organizing the routes in one file so its easier to manage
const router = Router();
router.use(usersRouter);
router.use(productsRouter);
router.use(clientsRouter);
router.use(ordersRouter);
router.use(qrcodeRouter);
router.use(yalidineRouter);
export default router;