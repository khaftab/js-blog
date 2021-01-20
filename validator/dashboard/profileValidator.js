const { body } = require('express-validator')
const validator = require('validator')

const urlValidator = value => {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error('Please provide a valid URL')
        }
    }
    return true
}

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name cannot be empty')
        .isLength({ max: 50 }).withMessage('Name cannot be more than 50 characters')
        .trim()
    ,
    body('title')
        .not().isEmpty().withMessage('Title cannot be empty')
        .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters')
        .trim()
    ,
    body('bio')
        .not().isEmpty().withMessage('Bio cannot be empty')
        .isLength({ max: 500 }).withMessage('Bio cannot be more than 500 characters')
        .trim()
    ,
    body('website')
        .custom(urlValidator)
    ,
    body('facebook')
        .custom(urlValidator)
    ,
    body('twitter')
        .custom(value => urlValidator(value)) // this is also same as above
    ,
    body('github')
        .custom(value => urlValidator(value))
    ,
]
