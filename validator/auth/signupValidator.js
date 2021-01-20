const User = require('../../models/User')
const { body } = require('express-validator')

module.exports = [
    body('username')
        .isLength({ min: 2, max: 15 }).withMessage('Username must be between 2 to  15 characters')
        .trim()
        .custom(async username => {
            const user = await User.findOne({ username })
            if (user) {
                return Promise.reject('Username already exists')
            }
            return true
        }),

    body('email')
        .normalizeEmail()
        .custom(async email => {
            const emailId = await User.findOne({ email })
            if (emailId) {
                return Promise.reject('Email already exists')
            }
            return true
        })
        .isEmail().withMessage('Please enter a valid email'),
    // isEmail messege overrighting promise message when emailId is exist 

    body('password')
        .isLength({ min: 5 }).withMessage('Password is too short'),

    body('confirmPassword')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Password does not match')
            }
            return true
        })
]