const bcrypt = require('bcryptjs')
const pool = require('../db/pool')
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy



exports.getSignUpForm = (req, res) => {
    res.render('sign-up-form')
}

exports.postSignUpForm = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await pool.query(
            'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)',
            [req.body.first_name, req.body.last_name, req.body.username, hashedPassword]
        )
        res.redirect('/')
    } catch (error) {
        console.error(error)
        next(error)
    }
}