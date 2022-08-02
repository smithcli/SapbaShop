const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.requireAuth,
  authController.updatePassword,
);

router
  .route('/')
  .get(
    authController.requireAuth,
    authController.restrictedTo('admin', 'manager', 'employee'),
    userController.getAllUsers,
  )
  .post(
    authController.requireAuth,
    authController.restrictedTo('admin'),
    userController.createUser,
  );

router
  .route('/me')
  .get(authController.requireAuth, userController.getMe)
  .patch(authController.requireAuth, userController.updateMe)
  .delete(authController.requireAuth, userController.deleteMe);

router
  .route('/:id')
  .get(
    authController.requireAuth,
    authController.restrictedTo('admin', 'manager', 'employee'),
    userController.getUser,
  )
  .patch(
    authController.requireAuth,
    authController.restrictedTo('admin'),
    userController.updateUser,
  )
  .delete(
    authController.requireAuth,
    authController.restrictedTo('admin'),
    userController.deleteUser,
  );

module.exports = router;
