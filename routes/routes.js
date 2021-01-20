const authRoute = require('./authRoute')
const dashboardRoute = require('./dashboardRoute')
const uploadRoute = require('./uploadRoute')
const postRoute = require('./postRoute')
const apiRoute = require('../api/routes/apiRoutes')
const explorerRoute = require('./explorerRoute')
const searchRoute = require('./searchRoute')
const authorRoute = require('./authorRoute')

const routes = [
    {
        path: '/auth',
        handeller: authRoute
    },
    {
        path: '/dashboard',
        handeller: dashboardRoute
    },
    {
        path: '/uploads',
        handeller: uploadRoute
    },
    {
        path: '/posts',
        handeller: postRoute
    },
    {
        path: '/explorer',
        handeller: explorerRoute
    },
    {
        path: '/search',
        handeller: searchRoute
    },
    {
        path: '/author',
        handeller: authorRoute
    },
    {
        path: '/api',
        handeller: apiRoute
    },
    {
        path: '/',
        handeller: (req, res) => res.redirect('/explorer')
    },
]

const setRoutes = app => {
    routes.forEach(route => {
        if (route.path === '/') {
            app.get(route.path, route.handeller)
        } else {
            app.use(route.path, route.handeller)
        }
    })
}

module.exports = setRoutes