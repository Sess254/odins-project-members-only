const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');

const validateSignUp = [
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required.')
        .escape(),
    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required.')
        .escape(),
    body('username')
        .trim()
        .isEmail()
        .withMessage('Username must be a valid email adress.')
        .normalizeEmail()
        .custom(async (value) => {
            const user = await pool.query('SELECT * FROM users WHERE username = $1', [value]);
            if (user.rows.length > 0) {
                throw new Error('A user with this email already exists.');
            }
        }),
    body('password')
        .isLength({min : 6}).withMessage('Password must be atleast 6 characters long.'),
    body('confirmPassword')
        .custom((value, {req} ) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password.');
            }
            return true;
        }),
];

module.exports = { validateSignUp };