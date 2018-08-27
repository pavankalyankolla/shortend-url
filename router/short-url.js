const express = require('express');
const { Url } = require('../models/short-url');
const mongoose = require('../config/db');

const _ = require('lodash');

const router = express.Router();

// router.get('/',(req,res) => {
//     res.send({
//         msg : 'Welcome to Url-Shortner'
//     })
// })
router.get('/',(req,res) => {
    Url.find().then((url) => {
        res.send(url);
    }) .catch((err) => {
        res.send(err);
    })
});

router.post('/',(req,res) => {
    let body = _.pick(req.body,['title','originalUrl','tags']);
    
    let url = new Url(body);

    url.save() .then((url) => {
        res.send(url);
    }) .catch((err) => {
        res.send(err);
    })
});

module.exports = {
    UrlRouter : router
}