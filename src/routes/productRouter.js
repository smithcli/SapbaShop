const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.requireAuth,
    authController.restrictedTo('admin', 'manager'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.requireAuth,
    authController.restrictedTo('admin', 'manager', 'employee'),
    productController.updateProduct
  )
  .delete(
    authController.requireAuth,
    authController.restrictedTo('admin', 'manager'),
    productController.deleteProduct
  );

module.exports = router;
