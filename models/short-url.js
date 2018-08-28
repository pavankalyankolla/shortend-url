const mongoose = require('mongoose');
const sh = require('shorthash');

const validator = require('validator');

const Schema = mongoose.Schema;

const urlSchema = new Schema({

    title : {
        type : String,
        required : true
    },
    originalUrl : {
        type : String,
        required : true,
        validate : {
            validator : function(value) {
                return validator.isURL(value);
            },
            message : function(props) {
                return `${props.path} is not valid`
            }
            
        }
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
        this.hashedUrl = sh.unique(`${this.originalUrl}`);
    }
    next();
})


const Url = mongoose.model('Url',urlSchema);

module.exports = {Url}