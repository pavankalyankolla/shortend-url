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
app.use(morgan('dev'));

app.use('/url',UrlRouter);

app.use(function (req,res,next){
    res.status(404);
    res.send({
        notice : '404 -The resource you are looking for doesn’t exist'
    })
})
app.listen(port,() => {
    console.log('listening port',port);
})