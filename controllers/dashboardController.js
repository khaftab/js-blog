const Flash = require("../utils/Flash")
const Profile = require('../models/Profile')
const Comment = require('../models/Comment')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter')

exports.dashboardGetController = async (req, res, next) => {

    try {
        const profile = await Profile.findOne({ user: req.user._id })
            .populate({
                path: 'posts',
                select: 'title thumbnail'
            })
            .populate({
                path: 'bookmarks',
                select: 'title thumbnail'
            })

        if (profile) {
            return res.render('pages/dashboard/dashboard',
                {
                    title: 'My Dashboard',
                    flashMessage: Flash.getMessage(req),
                    posts: profile.posts.reverse().slice(0, 3),
                    bookmarks: profile.bookmarks.reverse().slice(0, 3)
                })
        }

        res.redirect('/dashboard/create-profile')
    } catch (error) {
        next(error)
    }
}


exports.createProfileGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id })

        if (profile) {
            return res.redirect('edit-profile') // if we put forward slash then we have re write entire url
        }

        res.render('pages/dashboard/create-profile', {
            title: 'Create your profile',
            flashMessage: Flash.getMessage(req),
            error: {}
        })

    } catch (error) {
        next(error)
    }
}

exports.createProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter)
    console.log('errors object', errors.mapped())

    if (Object.keys(errors.mapped()).length >= 1) {
        return res.render('pages/dashboard/create-profile', {
            title: 'Create your profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped()
        })
    }

    const { name, title, bio, website, facebook, twitter, github } = req.body

    try {
        const profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePics: req.user.profilePics,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            },
            posts: [],
            bookmarks: []
        })

        const createdProfile = await profile.save()
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { profile: createdProfile._id } }
        )
        req.flash('success', 'Profile created successfully')
        res.redirect('/dashboard')


    } catch (error) {
        next(error)
    }


}

exports.editProfileGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id })
        !profile && res.redirect('/dashboard/create-profile')
        res.render('pages/dashboard/edit-profile', {
            title: 'Edit your profile',
            flashMessage: Flash.getMessage(req),
            error: {},
            profile
        })
    } catch (error) {
        next(error)
    }
}

exports.editProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter)
    const { name, title, bio, website, facebook, twitter, github } = req.body

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/edit-profile', {
            title: 'Edit your profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            profile: {
                name,
                title,
                bio,
                links: {
                    website: website || '',
                    facebook: facebook || '',
                    twitter: twitter || '',
                    github: github || ''
                }
            }
        })
    }

    try {
        const profile = {
            name,
            title,
            bio,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            },
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: profile },
            { new: true } // this will return the latest updated data
        )

        req.flash('success', 'Profile updated successfully')
        res.render('pages/dashboard/edit-profile', {
            title: 'Edit your profile',
            flashMessage: Flash.getMessage(req),
            error: {},
            profile: updatedProfile
        })

    } catch (error) {
        next(error)
    }
}

exports.bookmarksGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({user: req.user._id})
            // .populate({
            //     path: 'bookmarks',
            //     model: 'Post',
            //     select: 'title thumbnail'
            // })
            .populate({
                path: 'bookmarks',
                select: ['title', 'thumbnail']
            })

        console.log('Profile', profile)

        res.render('pages/dashboard/bookmarks', {
            title: 'Your Bookmarks',
            flashMessage: Flash.getMessage(req),
            posts: profile.bookmarks
        })
    } catch (error) {
        next(error)
    }
}

exports.commentsGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({user: req.user._id})
        // we want to get all the comments of all posts 
        // we use $in to find with array of properties
        const comments = await Comment.find({post: {$in: profile.posts}})
            .populate({
                path: 'post',
                select: 'title'
            })
            .populate({
                path: 'user',
                select: 'username profilePics'
            })
            .populate({
                path: 'replies.user',
                select: 'username profilePics'
            })
        
        res.render('pages/dashboard/comment', {
            title: 'Your Comments',
            flashMessage: Flash.getMessage(req),
            comments
        })

    } catch (error) {
        next(error)
    }
}



