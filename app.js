const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const sh = require('shorthash');

const { UrlRouter } = require('./router/short-url')



const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(morgan('dev'));


app.use('/url',UrlRouter);

app.listen(port,() => {
    console.log('listening port',port);
})