const Post = require('../../models/Post')
const Comment = require('../../models/Comment')

exports.commentPostController = async (req, res, next) => {
    const { postId } = req.params
    const { body } = req.body

    !req.user && res.status(403).json({ message: 'You are not authenticatd' })

    const comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: []
    })

    try {
        const createdComment = await comment.save()
        await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { 'comments': createdComment._id } }
        )

        const commentJSON = await Comment.findById(createdComment._id).populate({
            path: 'user',
            select: 'profilePics username'
        })

        return res.status(201).json(commentJSON)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Server error occured'
        })
    }
}

exports.replyCommentPostController = async (req, res, next) => {
    const { commentId } = req.params
    const { body } = req.body

    !req.user && res.status(403).json({ message: 'You are not authenticatd' })

    try {
        const reply = {
            user: req.user._id,
            body
        }

        await Comment.findOneAndUpdate(
            {_id: commentId},
            {$push: {'replies': reply}}
        )

        return res.status(201).json({
            ...reply,
            profilePics: req.user.profilePics
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Server error occured'
        })
    }
}