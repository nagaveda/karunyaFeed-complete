const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = mongoose.model('User')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {JWT_KEY} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API, EMAIL} = require('../config/keys')

const transporter =  nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))


router.post('/signup', (req, res) => {
    const {name, email, password, pic} = req.body;
    if(!email || !password || !name){
        res.status(422).json({error: "please add all the fields"});
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(442).json({error: "user already exists with that email"});
        }
        bcrypt.hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                email,
                password: hashedPassword,
                name,
                pic
            });
            user.save()
            .then((user) => {
                transporter.sendMail({
                    to:user.email,
                    from:"mail.karunyafeed@gmail.com",
                    subject: "Signup successful!",
                    html:`<h2>Dear ${user.name}, Welcome to KarunyaFeed!</h2>`
                }).then(result=>{
                    console.log("meil sent!",result);
                })  
                res.json({message: "Saved successfully!"});
            })
            .catch((err) => {
                console.log(err);
            })
        })
        
    })
    .catch((err) => {
        console.log(err);
    })
});

router.post('/signin',(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(422).json({error: "Please provide email/password !"});
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error: "Invalid credentials!"});
        }
        bcrypt.compare(password, savedUser.password)
        .then((doMatch) => {
            if(doMatch){
                const token = jwt.sign({_id: savedUser._id}, JWT_KEY);
                const {_id, name, email, followers, following, pic} = savedUser;
                res.json({token: token, user: {_id, name, email, followers, following, pic}})     
            }
            else{
                return res.status(422).json({error: "Invalid credentials!"});
            }
        })
        .catch((err) => {
            console.log(err);
        })
    })
    .catch((err) => {
        console.log(err);
    })
});

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err);
        }
        const token = buffer.toString("hex");
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User doesn't exist with the email!"});
            }
            user.resetToken = token;
            user.expireToken = Date.now() +  3600000;
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"mail.karunyafeed@gmail.com",
                    subject:"Password Reset",
                    html: `
                    <p>You requested for password reset</p>
                    <h5>Click on this <a href="${EMAIL}reset/${token}">link</a> to reset password</h5>`
                })
                res.json({message:"Check your email"});
            })
        })
    })
});

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again, session expired!"});
        }
        bcrypt.hash(newPassword, 12).then(hashedPassword => {
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save().then((savedUser) => {
                res.json({message:"Password updated succesfully!"});
            })
        })
    }).catch(err=>{
        console.log(err);
    });
});

module.exports = router;