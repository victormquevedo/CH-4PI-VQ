import {
  cartsService,
  productsService,
  ticketsService,
  usersService
} from '../repositories/_index.js';

export const createCart = async (req, res, next) => {
  try {
    const response = await cartsService.createCart();
    await usersService.addCartId(req.body.email, response.id);
    res.status(200).send(response);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const getCartById = async (req, res, next) => {
  try {
    const cart = await cartsService.getCartById(parseInt(req.params.cid));
    res.status(200).send(JSON.stringify(cart));
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const response = await cartsService.addProductToCart(
      parseInt(req.params.cid),
      parseInt(req.params.pid)
    );
    res.status(200).send(response);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const response = await cartsService.deleteProductFromCart(
      parseInt(req.params.cid),
      parseInt(req.params.pid)
    );
    res.status(200).send(response);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const response = await cartsService.updateCart(parseInt(req.params.cid), req.body);
    res.status(200).send(response);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const updateProductQuantityFromCart = async (req, res, next) => {
  try {
    const response = await cartsService.updateProductQuantityFromCart(
      parseInt(req.params.cid),
      parseInt(req.params.pid),
      req.body
    );
    res.status(200).send(response);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const deleteAllProductsFromCart = async (req, res, next) => {
  try {
    const response = await cartsService.deleteAllProductsFromCart(parseInt(req.params.cid));
    res.status(200).send(response);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const purchase = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const user = await usersService.getUserByCart(cid);
    const cart = await cartsService.getCartById(cid);
    let unavailableProducts = [];
    const amount = await cart.products.reduce(async (accPromise, cv) => {
      const acc = await accPromise;
      const product = await productsService.getProductById(cv.id);
      if (product.stock < cv.quantity) {
        unavailableProducts.push({ ...product, quantity: cv.quantity });
        return acc;
      }
      const newStock = product.stock - cv.quantity;
      await cartsService.deleteProductFromCart(cid, product.id);
      await productsService.updateProduct({ id: product.id, stock: newStock });
      const unitPrice = product.price;
      const totalPrice = cv.quantity * unitPrice;
      return acc + totalPrice;
    }, Promise.resolve(0));
    const response = {
      ...(await ticketsService.createTicket({ amount, purchaser: user.email })),
      unavailableProducts
    };
    res.status(200).send(response);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};
