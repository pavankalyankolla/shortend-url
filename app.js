const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');



const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(morgan('dev'));


app.listen(port,() => {
    console.log('listening port',port);
})