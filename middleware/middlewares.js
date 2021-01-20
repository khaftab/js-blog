const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const morgan = require('morgan')
const {bindUserWithRequest} = require('./authMiddleware')
const setLocals = require('./setLocals')
const MongoDBStore = require('connect-mongodb-session')(session);
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2
  });
 
const middlewares = [
    morgan('dev'),
    express.static('public'),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store
    }),
    flash(),
    bindUserWithRequest(),
    setLocals(),
]

const setMiddlewares = app => {
   app.use(middlewares)
}

module.exports = setMiddlewares