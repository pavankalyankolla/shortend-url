const express = require('express');
const { Url } = require('../models/short-url');
const mongoose = require('../config/db');

const _ = require('lodash');
const { authenticateUser } = require('../middleware/authentication');


const router = express.Router();

// router.get('/',(req,res) => {
//     res.send({
//         msg : 'Welcome to Url-Shortner'
//     })
// })
//template engine pug
// router.get('/', function (req, res) {
//     res.render('index', { title: 'Hey', message: 'Hello there!' })
//   });

router.get('/table',function(req,res) {
      Url.find().then((url) => {
          res.render('index',{users: url})
      })
    });



router.get('/',authenticateUser,(req,res) => {
    Url.find().then((url) => {
        res.send(url);
    }) .catch((err) => {
        res.send(err);
    })
});

//user having how many urls
router.get('/urls',authenticateUser,(req,res) => {
    Url.find({user : req.locals.user._id}).then((url) => {
        res.send(url);
    }) .catch((err) => {
        res.send(err);
    })
})

router.get('/:id',authenticateUser,(req,res) => {
    Url.findById((req.params.id),{clicks : {$slice : 3}}).then((url) => {
        res.send(url);
    }) .catch((err) => {
        res.send(err);
    });
});

router.post('/',authenticateUser,(req,res) => {
    let body = _.pick(req.body,['title','originalUrl','tags']);

    let url = new Url(body);
    url.user = req.locals.user._id;
    url.save() .then((url) => {
        res.send(url);
    }) .catch((err) => {
        res.send(err);
    })
});

router.put('/:id',authenticateUser,(req,res) => {
    let id = req.params.id;
    let body = req.body;
    Url.findByIdAndUpdate(id,{ $set : body}, {new : true}) .then((url) => {
        res.send(url);
    }) .catch((err) => {
        res.send(err);
    })
});

router.delete('/:id',authenticateUser,(req,res) => {
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