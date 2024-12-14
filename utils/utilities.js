import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize/config.js';
import { Order, Client } from '../sequelize/relation.js';



async function calculateCustomerRatingForClient(clientId) {
    try {
        // Fetch all orders related to this client using the 'cid' foreign key
        const client = await Client.findByPk(clientId, {
            include: [{
                model: Order,
                where: { cid: clientId },
                attributes: ['status']
            }]
        });

        if (!client) {
            throw new Error('Client not found');
        }

        const orders = client.Orders;

        // Count delivered and returned orders
        const productsPaid = orders.filter(order => order.status === 'delivered').length;
        const productsReturned = orders.filter(order => order.status === 'returned').length;

        const rating = productsPaid/ orders.length;
        // Calculate the rating
        return rating;
    } catch (error) {
        console.error('Error calculating customer rating:', error);
        return 0; // Return a default rating in case of error
    }
}

export { calculateCustomerRatingForClient };