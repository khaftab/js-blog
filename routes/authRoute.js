const router = require('express').Router()
const signupValidator = require('../validator/auth/signupValidator')
const loginValidator = require('../validator/auth/loginValidator')
const changePasswordValidator = require('../validator/auth/changePasswordValidator')

const { signupGetController, signupPostController, loginGetController, loginPostController, logoutController, changePasswordPostController, changePasswordGetController } = require('../controllers/authController')
const { isUnAuthenticated, isAuthenticated } = require('../middleware/authMiddleware')

router.get('/change-password', isAuthenticated, changePasswordGetController)
router.post('/change-password', isAuthenticated, changePasswordValidator, changePasswordPostController)
router.get('/signup', isUnAuthenticated, signupGetController)
router.post('/signup', isUnAuthenticated, signupValidator, signupPostController)
router.get('/login', isUnAuthenticated, loginGetController)
router.post('/login', isUnAuthenticated, loginValidator, loginPostController)
router.get('/logout', logoutController)

module.exports = router
