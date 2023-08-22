import { usersService } from '../repositories/_index.js';

export const current = async (req, res, next, store) => {
  try {
    store.get(req.sessionID, async (err, data) => {
      if (err) throw new Error({ message: `Error while trying to retrieve data session (${err})` });
      if (req.session.userValidated || req.sessionStore.userValidated) {
        const user = await usersService.getUserByEmail(req.sessionStore.email);
        req.sessionStore.user = user;
        res.redirect('/home/products');
      } else {
        res.redirect('/login');
      }
    });
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const register = async (req, res, next, baseUrl) => {
  try {
    const { first_name, last_name, age, login_email, login_password } = req.body;
    await usersService.addUser({
      firstName: first_name,
      lastName: last_name,
      age,
      email: login_email,
      password: login_password
    });
    req.session.userValidated = req.sessionStore.userValidated = true;
    req.sessionStore.email = login_email;
    res.redirect(baseUrl);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const login = async (req, res, next, baseUrl) => {
  try {
    if (!req.user) throw new Error({ message: 'Invalid credentials' });
    req.session.userValidated = req.sessionStore.userValidated = true;
    req.sessionStore.email = req.body.login_email;
    res.redirect(baseUrl);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const githubCallback = async (req, res, next, baseUrl) => {
  try {
    req.session.userValidated = req.sessionStore.userValidated = true;
    req.sessionStore.email = req.user.email;
    res.redirect(baseUrl);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const logout = async (req, res, next, baseUrl) => {
  try {
    req.session.userValidated = req.sessionStore.userValidated = false;
    req.session.destroy((err) => {
      req.sessionStore.destroy(req.sessionID, (err) => {
        if (err) throw new Error({ message: `Error while trying to destroy the session (${err})` });
        req.logger.info(`${new Date().toLocaleTimeString()} - Destroyed sesion`);
        res.redirect(baseUrl);
      });
    });
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};
