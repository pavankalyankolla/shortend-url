const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const sh = require('shorthash');
const useragent = require('express-useragent');

const { UrlRouter } = require('./router/short-url');

const fs = require('fs-extra');
const path = require('path');



const app = express();
const port = 3000;

app.set('view engine', 'pug')   

app.use(useragent.express());

app.use(bodyParser.json());
// app.use(morgan('dev'));

//middleware in access log
let accessStream = fs.createWriteStream(path.join('./logs','access.log') , {flags : 'a'});

app.use(morgan(function(tokens,req,res){
    return [ `Started : ${tokens.method(req,res)} : ${tokens.url(req,res)} for ${req.ip} at ${new Date()}
              Completed : ${tokens.status(req,res)} in  ${tokens['response-time'](req, res)}ms \n` ]
},{ stream : accessStream}));

//middleware in console
app.use(morgan(function(tokens,req,res){
    return [ `Started : ${tokens.method(req,res)} : ${tokens.url(req,res)} for ${req.ip} at ${new Date()}
              Completed : ${tokens.status(req,res)} in  ${tokens['response-time'](req, res)}ms ` ]
}))


app.use('/url',UrlRouter);

app.use(function (req,res,next){
    res.status(404);
    res.send({
        notice : '404 -The resource you are looking for doesn’t exist'
    })
});
app.listen(port,() => {
    console.log('listening port',port);
})