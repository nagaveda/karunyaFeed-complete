const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/nagaveda999/image/upload/v1594638348/images_ughhmp.png"
    },
    followers:[{
        type:ObjectId,
        ref: "User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }]
});

mongoose.model("User", userSchema);