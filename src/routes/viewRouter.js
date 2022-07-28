const express = require('express');
const viewController = require('../controllers/viewController');
const router = express.Router();

// To later implement a customer facing page.
router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/login', viewController.login);
router.get('/dashboard', viewController.getDashboard);
router.get('/manager', viewController.getManager);

router.get('/products', viewController.getProducts);
router.get('/stores', viewController.getStores);
module.exports = router;
