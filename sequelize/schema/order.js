import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
const Order = sequelize.define('Order', {
    oid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    total: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
export default Order;