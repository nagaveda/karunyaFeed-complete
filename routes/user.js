const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post');
const User = mongoose.model("User");

router.get('/user/:id',requireLogin, (req, res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, posts)=>{
            if(err){
                return res.status(422).json({error:err});
            }
            res.json({user, posts});
        })
    }).catch(err=>{
        console.log(err);
    });
});
router.put('/follow',requireLogin, (req, res)=>{
    User.findByIdAndUpdate(req.body.followId, {
        $push: {followers:req.user._id}
    },
    {new:true}, (err, result)=> {
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {following:req.body.followId}
        },{
            new: true
        }).select("-password").then(result=>{
            res.json(result);
        }).catch(err=>{
            return res.status(422).json({error:err});
        })
    })

});
router.put('/unfollow',requireLogin, (req, res)=>{
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {followers:req.user._id}
    },
    {new:true}, (err, result)=> {
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following:req.body.unfollowId}
        },{
            new: true
        }).select("-password").then(result=>{
            res.json(result);
        }).catch(err=>{
            return res.status(422).json({error:err});
        })
    })

});

router.put('/updatepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {pic:req.body.pic}
    },{new: true}, (err, result)=>{
        if(err){
            return res.status(422).json({error:"Pic couldn't be posted!"});
        }
        res.json(result);
    });
});
router.put('/updateuser', requireLogin, (req, res) => {
    
    if(req.user.email === req.body.email){
        User.findByIdAndUpdate(req.user._id, {
            $set:{
                name:req.body.name,
                email:req.body.email
            }
        },{new:true}, (err, result) => {
            if(err){
                return res.status(422).json({error:"Details couldn't be updated !"});
            }
            res.json({result:result});
        });
    }
    else{
        User.findOne({"email":req.body.email})
        .then((user)=>{
            if(user){
                return res.status(422).json({"error":"Email already exists!"});
            }
            User.findByIdAndUpdate(req.user._id, {
                $set:{
                    name:req.body.name,
                    email:req.body.email
                }
            },{new:true}, (err, result) => {
                if(err){
                    return res.status(422).json({error:"Details couldn't be updated !"});
                }
                res.json({result:result});
            });
            
        })
    }
    
});
router.delete('/deleteuser', requireLogin, (req, res) => {
    User.findByIdAndDelete(req.user._id, (err, result)=>{
        if(err){
            return res.json({error:err});
        }
        Post.deleteMany({postedBy:req.user._id},(err, data)=>{
            if(err){
                return res.json({error:err});
            }
            res.json(data);
        })
        
    });
    
});

router.post('/search-users', requireLogin, (req, res) => {
    let userPattern = new RegExp("^"+req.body.query,'i');
    User.find({email:{$regex:userPattern}})
    .select("_id email name pic")
    .then((user) =>{
        res.json({user});
    }).catch((err)=>{
        console.log(err);
    })
});

module.exports = router;