const express = require('express')
const controller = require('../controllers/controller')

const router = express.Router()

router.get('/sign-up', controller.getSignUpForm)
router.post('/sign-up', controller.postSignUpForm)

module.exports = router