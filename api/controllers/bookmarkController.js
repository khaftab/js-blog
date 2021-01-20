const Profile = require('../../models/Profile')

exports.bookmarksGetController = async (req, res, next) => {
    const { postId } = req.params
    let bookmark = null
    !req.user && res.status(403).json({ message: 'You are not authenticatd' })

    const userId = req.user

    try {
        const profile = await Profile.findOne({ user: req.user._id })

        if (profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate(
                { user: userId },
                { $pull: { 'bookmarks': postId } }
            )
            bookmark = false
        } else {
            await Profile.findOneAndUpdate(
                { user: userId },
                { $push: { 'bookmarks': postId } }
            )
            bookmark = true
        }

        res.status(200).json({
            bookmark
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Server error occured'
        })
    }
}