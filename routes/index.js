import { Router } from "express";
import usersRouter from './users.js';
import productsRouter from './products.js';
import clientsRouter from './clients.js';
const router = Router();
router.use(usersRouter);
router.use(productsRouter);
router.use(clientsRouter);
export default router;