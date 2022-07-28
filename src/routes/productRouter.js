const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

//router.get(
//  '/currentReport',
//  authController.requireAuth,
//  authController.restrictedTo('admin'),
//  productController.getCurrentReport
//);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.requireAuth,
    authController.restrictedTo('admin', 'manager'),
    productController.createProduct
  );

// TODO: restrict route
router.route('/mgt').get(productController.getAllProductsMangement);

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
