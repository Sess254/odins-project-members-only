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

exports.getJoinClub = (req, res) => {
    if (!req.user) {
        return res.redirect('/')
    }
    res.render('join-club-form')
} 

exports.postJoinClub = async (req, res) => {
    if (!req.user) {
        return res.redirect('/')
    }

    const { password } = req.body
    const secret_passcode = 'odin'
    if (password?.trim() === secret_passcode) {
        try {
            const result = await pool.query('UPDATE users SET membership_status = TRUE WHERE id = $1', [req.user.id])
            console.log('update result:', result.rows)
            req.user.membership_status = true
            res.redirect('/')
        } catch (err) {
            console.error(err)
            res.status(500).send('Sever')
        }
    } else {
        res.render('join-club-form')
    }
}