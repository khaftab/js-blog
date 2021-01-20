const cheerio = require('cheerio')
const moment = require('moment')

module.exports = () => {
    return (req, res, next) => {
        res.locals.user = req.user
        res.locals.isLoggedIn = req.isLoggedIn
        res.locals.truncate = html => {
            const node = cheerio.load(html)
            let text = node.text()
            text = text.replace(/(\r\r|\n|\r)/gm, '')

            if(text.length <= 100) return text
            return text.substr(0, 100) + '...'
        }
        res.locals.moment = time => moment(time).fromNow()

       
        next()
    }
}