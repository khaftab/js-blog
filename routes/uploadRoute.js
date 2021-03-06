const { uploadProfilePics, removeProfilePics, postImageUploadController } = require('../controllers/uploadController')
const { isAuthenticated } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const router = require('express').Router()


router.post('/profile-pics', isAuthenticated, upload.single('profilePics'), uploadProfilePics)

router.delete('/profile-pics', isAuthenticated, removeProfilePics)

router.post('/postimage', isAuthenticated, upload.single('post-image'), postImageUploadController)

module.exports = router