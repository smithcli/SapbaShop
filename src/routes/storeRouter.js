const express = require('express');
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(storeController.getAllStores)
  .post(
    authController.requireAuth,
    authController.restrictedTo('admin'),
    storeController.createStore,
  );

router
  .route('/:id')
  .get(storeController.getStore)
  .patch(
    authController.requireAuth,
    authController.restrictedTo('admin', 'manager'),
    storeController.updateStore,
  )
  .delete(
    authController.requireAuth,
    authController.restrictedTo('admin'),
    storeController.deleteStore,
  );

module.exports = router;
