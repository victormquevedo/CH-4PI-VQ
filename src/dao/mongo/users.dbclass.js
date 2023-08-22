import usersModel from '../../models/users.model.js';
import CustomError from '../../services/customErrors.js';
import { errorsDict } from '../../utils/errorsDict.js';
import { createHash } from '../../utils/validation.js';

class UsersManager {
  constructor() {
    this.users = [];
  }

  addUser = async ({ firstName, lastName, age, email, password }) => {
    try {
      if ([email, password].includes(undefined)) {
        throw new Error(`Not Valid - insufficient data`);
      }
      await usersModel.create({
        first_name: firstName,
        last_name: lastName,
        age,
        email,
        password: createHash(password),
        role: 'user'
      });
      return { message: `User registered satisfactory` };
    } catch (err) {
      throw new CustomError(errorsDict.DATABASE_ERROR, `addUser - ${err}`, true);
    }
  };

  addCartId = async (email, cartId) => {
    try {
      await usersModel.updateOne({ email }, { $set: { cart: cartId } });
    } catch (err) {
      throw new CustomError(errorsDict.DATABASE_ERROR, `addCartId - ${err}`, true);
    }
  };

  getUserByEmail = async (email) => {
    try {
      return await usersModel.findOne({ email }).lean();
    } catch (err) {
      throw new CustomError(errorsDict.DATABASE_ERROR, `getUserByEmail - ${err}`, true);
    }
  };

  getUserById = async (id) => {
    try {
      const user = await usersModel.findById(id);
      if (!user) throw new Error('User not found');
      return user;
    } catch (err) {
      throw new CustomError(errorsDict.DATABASE_ERROR, `getUserById - ${err}`, true);
    }
  };

  getUserByCart = async (cartId) => {
    try {
      const user = await usersModel.findOne({ cart: cartId });
      if (!user) throw new Error('Cart is empty'); // El id del carrito se genera desde el front cuando el usuario ingresa el primer producto
      return user;
    } catch (err) {
      throw new CustomError(errorsDict.DATABASE_ERROR, `getUserByCart - ${err}`, true);
    }
  };
}

export default UsersManager;
