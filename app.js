const express = require('express')
const mongoose = require('mongoose')
const setRoute = require('./routes/routes')
const setMiddlewares = require('./middleware/middlewares')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// set up view engine

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

// middleware

setMiddlewares(app)


// using route 
setRoute(app)

// setting 404 middleware

app.use((req, res, next) => {
    const error = {}
    error.status = 404
    next(error)
})

// we are passing error status via next method to the next middleware
// for internal server error above code won't execute

app.use((error, req, res, next) => {
    console.log(error)
    if (error.status === 404) {
        return res.render('pages/error/404', {flashMessage: {}})
    }
    
    res.render('pages/error/500', {flashMessage: {}})
})

const PORT = process.env.PORT || 5000

mongoose.connect( process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    })
    .catch(e => console.log(e))


