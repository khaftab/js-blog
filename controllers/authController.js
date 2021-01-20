const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const errorFormatter = require('../utils/validationErrorFormatter')
const Flash = require('../utils/Flash')

exports.signupGetController = (req, res, next) => {
    res.render('pages/auth/signup',
        {
            title: 'Create a new Account',
            error: {},
            value: {},
            flashMessage: Flash.getMessage(req)
        })
}

exports.signupPostController = async (req, res, next) => {
    const { username, email, password } = req.body
    const errors = validationResult(req).formatWith(errorFormatter)
    
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your form')
        return res.render('pages/auth/signup',
            {
                title: 'Create a new Account',
                error: errors.mapped(),
                value: { username, email, password },
                flashMessage: Flash.getMessage(req)
            })
    }


    try {
        const hashedPassword = await bcrypt.hash(password, 11)
        const user = new User({
            username,
            email,
            password: hashedPassword
        })
        await user.save()
        req.flash('success', 'User created successfully')
        res.redirect('/auth/login')
    } catch (error) {
        next(error)
    }
}


exports.loginGetController = (req, res, next) => {

    res.render('pages/auth/login', {
        title: 'Login To Your Account',
        error: {},
        flashMessage: Flash.getMessage(req)
    })
}

exports.loginPostController = async (req, res, next) => {
    const { email, password } = req.body

    const errors = validationResult(req).formatWith(errorFormatter)
   

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your form')
        return res.render('pages/auth/login', {
            title: 'Login To Your Account',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            req.flash('fail', 'Please provide valid credentials')
            return res.render('pages/auth/login', {
                title: 'Login To Your Account',
                error: {},
                flashMessage: Flash.getMessage(req)
            })
        }

        const match = await bcrypt.compare(password, user.password)
        !match && res.render('pages/auth/login', {
            title: 'Login To Your Account',
            error: {},
            flashMessage: Flash.getMessage(req)
        })

        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(err => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Successfully logged in')
            return res.redirect('/dashboard')
        })

    } catch (error) {
        next(error)
    }
}


exports.logoutController = (req, res, next) => {
    req.session.destroy(err => {
        return next(err)
    })
    
    return res.redirect('/auth/login')
}

exports.changePasswordGetController = (req, res, next) => {
    res.render('pages/auth/changePassword', {
        title: 'Change your password',
        flashMessage: Flash.getMessage(req),
        error: {}
    })
}

exports.changePasswordPostController = async (req, res, next) => {
    const {oldPassword, newPassword, confirmPassword} = req.body

    const errors = validationResult(req).formatWith(errorFormatter)

    
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your form')
        return res.render('pages/auth/changePassword',
            {
                title: 'Change your password',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req)
            })
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 11)
        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {password: hashedPassword}}
        )

        req.flash('success', 'Password chages successfully')
        return res.redirect('/auth/change-password')
    } catch (error) {
        next(error)
    }

  
}

