const Post = require('../../models/Post')



exports.likesGetController = async (req, res, next) => {
    const { postId } = req.params
    
    let liked = null

    !req.user && res.status(403).json({ message: 'You are not authenticatd' })

    const userId = req.user._id


    try {
        const post = await Post.findById(postId)

        // Checking if the user has alread disliked a post if so then we must remove them from dislike array

        if (post.dislikes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'dislikes': userId } }
            )
        }

        // if user already liked a post we are removing that

        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'likes': userId } }
            )
            liked = false
        } else {
            // pushing that user if he like a post
            await Post.findByIdAndUpdate(
                { _id: postId },
                { $push: { 'likes': userId } }
            )
            liked = true
        }

        const updatedPost = await Post.findById(postId)
        res.status(200).json({
            liked,
            totalLikes: updatedPost.likes.length,
            totalDislikes: updatedPost.dislikes.length
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Server error occured'
        })
    }
}

exports.dislikeGetController = async (req, res, next) => {
    const { postId } = req.params
    const userId = req.user._id

    let disliked = null

    !req.user && res.status(403).json({ message: 'You are not authenticatd' })

    try {
        const post = await Post.findById(postId)


        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'likes': userId } }
            )
        }

        if (post.dislikes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'dislikes': userId } }
            )
            disliked = false
        } else {
            // pushing that user if he like a post
            await Post.findByIdAndUpdate(
                { _id: postId },
                { $push: { 'dislikes': userId } }
            )
            disliked = true
        }

        const updatedPost = await Post.findById(postId)
        res.status(200).json({
            disliked,
            totalLikes: updatedPost.likes.length,
            totalDislikes: updatedPost.dislikes.length
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Server error occured'
        })
    }
}