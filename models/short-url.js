const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const urlSchema = new Schema({

    title : {
        type : String,
        required : true
    },
    OriginalUrl : {
        type : String,
        required : true
    },
    tags : {
        type : [String],
        required : true
    },
    hashedUrl : {
        type : String
    },
    created : {
        type : Date,
        default : Date.now
    }
})

const Url = mongoose.model('Url',urlSchema);

module.exports = {Url}