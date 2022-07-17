const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.requireAuth,
    authController.restrictedTo('admin', 'manager', 'employee'),
    userController.getAllUsers
  )
  .post(
    authController.requireAuth,
    authController.restrictedTo('admin'),
    userController.createUser
  );

router
  .route('/:id')
  .get(
    authController.requireAuth,
    authController.restrictedTo('admin', 'manager', 'employee'),
    userController.getUser
  )
  .patch(
    authController.requireAuth,
    authController.restrictedTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.requireAuth,
    authController.restrictedTo('admin'),
    userController.deleteUser
  );

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;
