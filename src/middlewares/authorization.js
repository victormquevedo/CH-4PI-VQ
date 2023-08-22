import CustomError from '../services/customErrors.js';
import { errorsDict } from '../utils/errorsDict.js';

const ADMIN = 'admin';
const USER = 'user';

export const adminAuthorization = async (req, res, next) => {
  try {
    if (req.sessionStore.user.role === ADMIN) {
      next();
    } else {
      throw new CustomError(errorsDict.UNAUTHORIZED);
    }
  } catch (err) {
    req.logger.fatal(`${new Date().toLocaleTimeString()} - ${err.message}`);
    next(err);
  }
};

export const userAuthorization = async (req, res, next) => {
  try {
    if (req.sessionStore.user.role === USER) {
      next();
    } else {
      throw new CustomError(errorsDict.UNAUTHORIZED);
    }
  } catch (err) {
    req.logger.fatal(`${new Date().toLocaleTimeString()} - ${err.message}`);
    next(err);
  }
};
