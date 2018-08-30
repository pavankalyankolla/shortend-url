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

router.get('/:id',(req,res) => {
    Url.findById((req.params.id),{clicks : {$slice : 3}}).then((url) => {
        res.send(url);
    }) .catch((err) => {
        res.send(err);
    });
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

router.put('/:id',(req,res) => {
    let id = req.params.id;
    let body = req.body;
    Url.findByIdAndUpdate(id,{ $set : body}, {new : true}) .then((url) => {
        res.send(url);
    }) .catch((err) => {
        res.send(err);
    })
});

router.delete('/:id',(req,res) => {
    Url.findByIdAndRemove(req.params.id).then((url) => {
        if(url){
            res.send({
                url,
                notice:'sucessfully deleted'
            });
        } else{
            res.send({
                notice:'url not found'
            });
        }
    }).catch(err => res.send(err));
});

router.get('/hashedUrl/:hash',(req,res) => {
    let params = req.params.hash;
    let info = {
        ipAddress : req.ip,
        browserName : req.useragent.browser,
        osType : req.useragent.os,
        DeviceType : req.useragent.isDesktop ? 'Desktop' : 'Mobile'
    }
    Url.findOneAndUpdate({hashedUrl : params},{ $push : { clicks : info } },{ new : true}) 
    .then((url) => {
        res.send(url);
    }) .catch((err) => {
        res.send(err);
    });
});

router.get('/data/tags/:name',(req,res) => {
    let params = req.params.name;
    Url.find({tags : params}) .then((url) => {
        if(url.length !== 0) {
            res.send(url);
        } else {
            res.send({
                notice : 'Tag not found'
            })
        }
    });
});

router.get('/info/tags',(req,res) => {
    let query = req.query.names.split(',');
    Url.find({tags : { "$in" : query}}) .then((url) => {
        if(url.length !== 0) {
            res.send(url);
        } else {
            res.send({
                notice : 'Tag not found'
            })
        }
    })
    
})

module.exports = {
    UrlRouter : router
}