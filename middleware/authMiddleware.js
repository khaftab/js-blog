const User = require("../models/User")

exports.bindUserWithRequest = () => {
    return async (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return next()
        }

        try {
            const user = await User.findById(req.session.user._id)
            req.user = user
            req.isLoggedIn = true
            console.log('req user', req.user)
            next()
        } catch (error) {
            console.log(error)
            next(error)
        }

    }
}

exports.isAuthenticated = (req, res, next) => {
    !req.session.isLoggedIn && res.redirect('/auth/login')
    next()
}

exports.isUnAuthenticated = (req, res, next) => {
    if (req.isLoggedIn) {
        return res.redirect('/dashboard')
    }
     next()
}

