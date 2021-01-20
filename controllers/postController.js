const { validationResult } = require("express-validator")
const errorFormatter = require('../utils/validationErrorFormatter')
const Flash = require("../utils/Flash")
const readingTime = require('reading-time')
const Post = require('../models/Post')
const Profile = require("../models/Profile")

exports.createPostGetController = (req, res, next) => {
    res.render('pages/dashboard/post/create-post', {
        title: 'Create post',
        error: {},
        flashMessage: Flash.getMessage(req),
        value: {}
    })
}

exports.createPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body
    const errors = validationResult(req).formatWith(errorFormatter)
    console.log(errors.mapped())
    if (!errors.isEmpty()) {

        return res.render('pages/dashboard/post/create-post', {
            title: 'Create post',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
            value: {
                title,
                body,
                tags
            }
        })
    }

    if (tags) {
        tags = tags.split(', ')
        console.log(tags)
    }

    const readTime = readingTime(body).text

    const post = new Post({
        title,
        body,
        tags,
        author: req.user._id,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []
    })

    if(req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        const createdPost = await post.save()
        await Profile.findOneAndUpdate(
            {user: req.user._id},
            {$push: {'posts': createdPost._id}}
        )
        

        req.flash('success', 'Post created successfully')
        return res.redirect(`/posts/edit/${createdPost._id}`)

    } catch (error) {
        next(error)
    }
}

exports.editPostGetController = async (req, res, next) => {
    const postId = req.params.postId

    try {
        const post = await Post.findOne({author: req.user._id, _id: postId}) // it will check the both condition
        if (!post) {
            const error = new Error('404 page not found')
            error.status = 400
            throw error
        }

        res.render('pages/dashboard/post/edit-post', {
            title: 'Edit your post',
            error: {},
            flashMessage: Flash.getMessage(req),
            post
        })

    } catch (error) {
        next(error)
    }
}


exports.editPostPostController = async (req, res, next) => {
    let {title, body, tags} = req.body
    const postId = req.params.postId

    
    try {

        const post = await Post.findOne({author: req.user._id, _id: postId})

        if (!post) {
            const error = new Error('404 page not found')
            error.status = 400
            throw error
        }

        const errors = validationResult(req).formatWith(errorFormatter)
        console.log(errors.mapped())
        if (!errors.isEmpty()) {
    
            return res.render('pages/dashboard/post/create-post', {
                title: 'Create post',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req),
                post
            })
        }
    
        if (tags) {
            tags = tags.split(', ')
        }

        let thumbnail = post.thumbnail
        if(req.file) {
            thumbnail = `uploads/${req.file.filename}`
        }

        await Post.findOneAndUpdate(
            {_id: post.id},
            {$set: {title, body, tags, thumbnail}}
        )

        req.flash('success', 'Successfully updated post')
        res.redirect(`/posts/edit/${post._id}`)


    } catch (error) {
        next(error)
    }
}

exports.deletePostGetController = async (req, res, next) => {
    const {postId} = req.params

    try {
        const post = await Post.findOne({author: req.user._id, _id: postId})

        if(!post) {
            const error = new Error('404 page not found')
            error.status = 404
            throw error
        }

        await Post.findOneAndDelete({_id: postId})
        await Profile.findOneAndRemove(
            {user: req.user._id},
            {$pull: {'posts': postId}}
        )

        req.flash('Post Deleted Successfully')
        res.redirect('/posts')

    } catch (error) {
        next(error)
    }
}

exports.postGetController = async (req, res, next) => {
    try {
        const posts = await Post.find({author: req.user._id})
        res.render('pages/dashboard/post/posts',{
            title: 'My All Posts',
            posts,
            flashMessage: Flash.getMessage(req)
        })
    } catch (error) {
        next(error)
    }
}