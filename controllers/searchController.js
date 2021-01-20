const Post = require("../models/Post")
const Flash = require("../utils/Flash")

exports.searchResultGetController = async (req, res, next) => {
    const term = req.query.term
    const currentPage = req.query.page || 1
    const itemPerPage = 10

    try {
        const posts = await Post.find({
            $text: {
                $search: term
            }
        }).skip((currentPage * itemPerPage) - itemPerPage)

        const totalPost = await Post.countDocuments({
            $text: {
                $search: term
            }
        })

        const totalPage = totalPost / itemPerPage

        res.render('pages/explorer/search', {
            title: 'Search result for ' + term,
            flashMessage: Flash.getMessage(req),
            searchTerm: term,
            itemPerPage,
            totalPage,
            currentPage,
            posts
        })
    } catch (error) {
        next(error)
    }
}