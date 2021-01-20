const { body } = require('express-validator')
const cheerio = require('cheerio')

module.exports = [
    body('title')
        .not().isEmpty().withMessage('Title cannot be empty')
        .isLength({max: 100}).withMessage('Title cannot be more than 100 characters')
        .trim()
    ,
    body('body')
        .not().isEmpty().withMessage('Body cannot be empty')
        .custom(value => {
            const node = cheerio.load(value)
            const text = node.text()

            if (text.length > 5000) {
                throw new Error('Body cannot be more than 5000 characters')
            }

            return true

        })
    ,
    body('tags')
        .not().isEmpty().withMessage('Provide at least 1 tag')
        .custom(value => {
            const tags = value.split(', ') // this will return array without space 
            if(tags.length > 15) {
                throw new Error('Max 15 tags are allowed')
            }
            return true
        })
        .trim()
]