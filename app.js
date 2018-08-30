const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const sh = require('shorthash');
const useragent = require('express-useragent');

const { UrlRouter } = require('./router/short-url')



const app = express();
const port = 3000;

app.use(useragent.express());

app.use(bodyParser.json());
// app.use(morgan('dev'));

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