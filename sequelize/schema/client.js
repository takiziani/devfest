import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
import { calculateCustomerRatingForClient } from '../../utils/utilities.js';

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
    rating: {
        type: DataTypes.VIRTUAL, // Specify it's a virtual field
        get() {
          return calculateCustomerRatingForClient(this.cid); // Computed property
        }
    }

    },{
    updatedAt: false,
    defaultScope: {
        attributes: { include: ['rating'] }
    }
});

export default Client;
