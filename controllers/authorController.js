const Flash = require('../utils/Flash')
const User = require('../models/User')

exports.authorProfileGetController = async (req, res, next) => {

    const userId = req.params.userId

    try {

        const author = await User.findById(userId)
            // .populate('profile')
            .populate({
                path: 'profile',
                populate: {
                    path: 'posts'
                }
            })

            console.log(author)

            res.render('pages/explorer/author', {
                title: 'Author page',
                flashMessage: Flash.getMessage(req),
                author
            })
            
    } catch (error) {
        next(error)
    }


}