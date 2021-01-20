const {body} = require('express-validator')
const User = require('../../models/User')
const bcrypt = require('bcrypt')

module.exports = [
    body('oldPassword')
        .not().isEmpty().withMessage('Old password cannot be empty')
        .custom(async (oldPassword, {req}) => {
            const user = await User.findOne({email: req.user.email})
            const match = await bcrypt.compare(oldPassword, user.password)
            if(!match) {
                return Promise.reject('Old password does not match with your current password')
            }
            return true
        })
    ,
    body('newPassword')
        .not().isEmpty().withMessage('New password cannot be empty')
        .isLength({ min: 5 }).withMessage('Password is too short')
    ,
    body('confirmPassword')
        .not().isEmpty().withMessage('Confirm password cannot be empty')
        .custom(async (confirmPassword, {req}) => {
            if(confirmPassword !== req.body.newPassword) {
                return Promise.reject('Confirm password does not match')
            }

            return true
        })
]