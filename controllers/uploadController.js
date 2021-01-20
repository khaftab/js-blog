const User = require('../models/User')
const Profile = require('../models/Profile')
const fs = require('fs')

exports.uploadProfilePics = async (req, res, next) => {
    if (req.file) {
        try {
            const oldProfilePics = req.user.profilePics
            const profile = await Profile.findOne({ user: req.user._id })
            const profilePics = `/uploads/${req.file.filename}`

            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    {
                        $set: { profilePics }
                    })
            }
            await User.findOneAndUpdate({ _id: req.user._id },
                { $set: { profilePics } }
            )

            if (oldProfilePics !== '/uploads/default-avatar.png') {
                fs.unlink(`public${oldProfilePics}`, err => err && console.log(err))
            }

            res.status(200).json({
                profilePics
            })

        } catch (error) {
            next(error)
        }
    } else {
        res.status(200).json({
            profilePics: req.user.profilePics
        })
    }
}

exports.removeProfilePics = async (req, res, next) => {

    const defaultProfilePics = '/uploads/default-avatar.png'
    const profile = await Profile.findOne({ user: req.user._id })
    const currentProfile = req.user.profilePics
    console.log('I am')

    fs.unlink(`public${currentProfile}`, async (err) => {
        try {
            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics: defaultProfilePics } }
                )
            }
            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { profilePics: defaultProfilePics } }
            )
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Failed remove profile image'
            })
        }
    })
    res.status(200).json({
        profilePics: defaultProfilePics
    })
}

exports.postImageUploadController = (req, res, next) => {
    if (req.file) {
        return res.status(200).json({
            imgUrl: `/uploads/${req.file.filename}`
        })
    }
    return res.status(500).json({
        message: 'Server Error'
    })
}

