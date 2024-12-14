import { Order, Client } from '../sequelize/relation.js';
async function calcrating(clientId) {
    try {
        // Fetch all orders related to this client using the 'cid' foreign key
        const orders = await Order.findAll({ where: { cid: clientId }, include: Client });
        if (!orders) {
            throw new Error('Client does not have order');
        }
        // Filter orders to get only delivered ones
        const deliveredOrders = orders.filter(order => order.status === 'dilivered');
        // Calculate the rating based on the number of delivered orders
        console.log('deliveredOrders:', deliveredOrders.length);
        let rating = parseFloat((deliveredOrders.length / orders.length) * 100).toFixed(2);
        return rating;
    } catch (error) {
        console.error('Error calculating customer rating:', error);
        return 0; // Return a default rating in case of error
    }
}

export default calcrating;