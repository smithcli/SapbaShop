const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

// To later implement a customer facing page.
router.get('/', (req, res) => {
  res.redirect('/login');
});
router.get('/login', viewController.login);
router.get('/forgotPassword', viewController.forgotPassword);

// Require Authentication beyond this point
router.get(
  '*',
  authController.requireAuth,
  authController.restrictedTo('admin', 'manager', 'employee'),
);

router.get('/dashboard', viewController.getDashboard);
router.get('/products', viewController.getProducts);
router.get('/products/addProduct', viewController.addProduct);
router.get('/products/:slug', viewController.getProduct);
router.get('/stores', viewController.getStores);
router.get('/stores/addStore', viewController.addStore);
router.get('/stores/:slug', viewController.getStore);
router.get('/users', viewController.getUsers);
router.get('/users/addUser', viewController.addUser);
router.get('/users/:slug', viewController.getUser);
router.get('/me', viewController.getMe);
module.exports = router;
