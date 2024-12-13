import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
const Order = sequelize.define('Order', {
    oid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    confirmation_hour: {
        type: DataTypes.DATE,
        allowNull: true
    },
    rate: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
export default Order;