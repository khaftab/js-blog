const router = require('express').Router()
const {authorProfileGetController} = require('../controllers/authorController')

router.get('/:userId', authorProfileGetController)

module.exports = router

