import User from "./schema/user.js";
import Client from "./schema/client.js";
import Product from "./schema/product.js";
import Order from "./schema/order.js";
// establish the relationships between the tables
User.hasMany(Client, { foreignKey: 'id_user' });
Client.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(Product, { foreignKey: 'id_user' });
Product.belongsTo(User, { foreignKey: 'id_user' });
Client.belongsToMany(Product, { through: Order, foreignKey: 'cid' });
Product.belongsToMany(Client, { through: Order, foreignKey: 'pid' });
Order.belongsTo(Client, { foreignKey: 'cid' });
Order.belongsTo(Product, { foreignKey: 'pid' });
export { User, Client, Product, Order };