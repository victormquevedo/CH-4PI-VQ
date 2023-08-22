import { productsService } from '../repositories/_index.js';

export const getProducts = async (req, res, next) => {
  try {
    const products = await productsService.getProducts(req.query);
    res.status(200).send(JSON.stringify(products));
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productsService.getProductById(parseInt(req.params.pid));
    res.status(200).send(JSON.stringify(product));
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const addProduct = async (req, res, next, wss) => {
  try {
    const newProduct = req.body;
    const response = await productsService.addProduct(newProduct);
    const newId = response.id;
    res.status(200).send(response);
    wss.emit('new_product', { response, newProduct, newId });
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const response = await productsService.updateProduct({
      id: parseInt(req.params.pid),
      ...req.body
    });
    res.status(200).send(response);
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};

export const deleteProduct = async (req, res, next, wss) => {
  try {
    const response = await productsService.deleteProduct(parseInt(req.params.pid));
    res.status(200).send(response);
    wss.emit('deleted_product', { response, deletedId });
  } catch (err) {
    req.logger.fatal(
      `${new Date().toLocaleTimeString()} - ${req.method} - ${req.url} - ${err.message}`
    );
    next(err);
  }
};
