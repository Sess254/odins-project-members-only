const express = require('express')
const controller = require('../controllers/controller')

const router = express.Router()

router.get('/sign-up', controller.getSignUpForm)
router.post('/sign-up', controller.postSignUpForm)
router.get('/join-club', controller.getJoinClub)
router.post('/join-club', controller.postJoinClub)

module.exports = router