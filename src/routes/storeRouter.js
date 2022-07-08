const express = require('express');
const storeController = require('../controllers/storeController');

const router = express.Router();

router
  .route('/')
  .get(storeController.getAllStores)
  .post(storeController.createStore);

//router.route('/:id').get(storeController.getStore);

module.exports = router;
