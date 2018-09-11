const express = require('express');
const _ = require('lodash');
const { User } = require('../models/user');
const { authenticateUser } = require('../middleware/authentication');
const router = express.Router();

// router.get('/',(req,res) => {
//     res.send('welcome to users');
// })
router.get('/',(req,res) => {
    User.find().then((user) => {
        res.send(user);
    }) .catch((err) => {
        res.send(err);
    })
});
//signup route
router.post('/',(req,res) => {
    let body = _.pick(req.body,['username','email','password','mobile']);
    let user = new User(body);

    user.save().then((user) => {
        return user.generateToken()
    }) .then((token) => {
        res.header('x-auth',token).send(user);
    }) .catch((err) => {
        res.send(400).send(err);
    })
});

//custom middleware
let authenticationUser = ((req,res,next) => {
    let token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        req.locals = {
            user,
            token
        }
        next();
    }) .catch((err) => {
        res.status(401).send(err);
    })
});

//login route
router.post('/login',(req,res) => {
    let body = _.pick(req.body,['email','password']);
    User.findByEmailAndPassword(body.email,body.password)
    .then((user) => {
        return user.generateToken();
    }) .then((token) => {
        res.header('x-auth',token).send()
    })
    .catch((err) => {
        res.send(err);
    });
});


//logout
router.delete('/logout',authenticateUser,(req,res) => {
    req.locals.user.deleteToken(req.locals.token).then(() => {
        res.send();
    }) .catch((err) => {
        res.send(err);
    });
});

//user profile
router.get('/profile',authenticationUser,(req,res) => {
    res.send(req.locals.user);
})


module.exports = {
    usersRouter : router
}