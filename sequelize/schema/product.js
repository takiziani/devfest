import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
const Product = sequelize.define('Product', {
    pid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});
export default Product;