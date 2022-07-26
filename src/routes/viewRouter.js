const express = require('express');
const viewController = require('../controllers/viewController');
const router = express.Router();

// To later implement a customer facing page.
router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/login', viewController.login);
router.get('/dashboard', viewController.getDashboard);

module.exports = router;
