const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.get('/sign-up', userController.signUpFormGet);
router.post('/sign-up', userController.signUpPost);

module.exports = router;