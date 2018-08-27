const mongoose = require('mongoose');
const sh = require('shorthash');

const Schema = mongoose.Schema;

const urlSchema = new Schema({

    title : {
        type : String,
        required : true
    },
    originalUrl : {
        type : String,
        required : true
    },
    tags: [ String ],
    hashedUrl : {
        type : String
    },
    created : {
        type : Date,
        default : Date.now
    }
})

urlSchema.pre('save',function(next) {
    if(!this.hashedUrl){
        this.hashedUrl = sh.unique(`${this.OriginalUrl}`);
    }
    next();
})


const Url = mongoose.model('Url',urlSchema);

module.exports = {Url}