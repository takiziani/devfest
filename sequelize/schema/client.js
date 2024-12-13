import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
const Client = sequelize.define('Client', {
    cid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },

});

export default Client;