const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const pool = require('../db/pool');

exports.signUpFormGet = (req, res) => {
    res.render('users/sign-up-form', { errors: null, formData: {} });
}

exports.signUpPost = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).render('users/sign-up-form', {
            errors: errors.array(),
            formData: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
            }
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query(
            `INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)`,
            [req.body.first_name, req.body.last_name, req.body.username, hashedPassword]
        );

        res.redirect('/log-in');
    } catch (error) {
        return next(error);
    }
}