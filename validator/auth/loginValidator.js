const {body} = require('express-validator')
const User = require('../../models/User')
const bcrypt = require('bcrypt')

module.exports = [
    body('email')
        .not().isEmpty().withMessage('Email cannot be empty')
        .normalizeEmail()
        .custom(async email => {
            const emailId = await User.findOne({email})
            if(!emailId) {
                return Promise.reject('No user is exists with this email')
            }
            return true
        })
        .isEmail().withMessage('Please enter a valid email'),
    body('password')
        .not().isEmpty().withMessage('Password cannot be empty')
        .custom(async (password, {req}) => {
        
            const user = await User.findOne({email: req.body.email})
            const result = user && await bcrypt.compare(password, user.password)

            if (!result) {
                return Promise.reject('Password is wrong')
            }
            return true
        })
]