import config from '../utils/config.js';
import MongoSingleton from './mongo.js';
// Fs Services
import FsProducts from './fs/products.fsclass.js';
import FsCarts from './fs/carts.fsclass.js';
// Mongo Services
import MongoProducts from './mongo/products.dbclass.js';
import MongoCarts from './mongo/carts.dbclass.js';
import MongoMessages from './mongo/messages.dbclass.js';
import MongoUsers from './mongo/users.dbclass.js';
import MongoTickets from './mongo/tickets.dbclass.js';


let FactoryProducts;
let FactoryCarts;

MongoSingleton.getInstance();
let FactoryMessages = MongoMessages;
let FactoryUsers = MongoUsers;
let FactoryTickets = MongoTickets;

switch (config.PERSISTENCE) {
  case 'fs':
    FactoryProducts = FsProducts;
    FactoryCarts = FsCarts;
    break;

  case 'mongo':
    FactoryProducts = MongoProducts;
    FactoryCarts = MongoCarts;
    break;

  default:
}

export { FactoryProducts, FactoryCarts, FactoryMessages, FactoryUsers, FactoryTickets };
