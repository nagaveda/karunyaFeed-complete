const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post');
const paginatePosts = require('../middleware/paginatedPosts');
const paginateSubPosts = require('../middleware/paginateSubPosts');

router.get('/allposts',requireLogin ,paginatePosts , (req, res)=> {
    res.json(res.paginatedResults);
});

router.get('/getsubposts',requireLogin, paginateSubPosts, (req, res)=> {
    res.json(res.paginatedResults);
});

router.post('/createpost', requireLogin , (req, res) => {
    const {title, body, pic} = req.body;
    if(!title || !body || !pic){
        return res.status(422).json({error: "Please add all the fields."})
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
         
    });
    post.save()
    .then(result => {
        res.json({post:result});
    })
    .catch(err => console.log(err));
});

router.get('/myposts', requireLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .populate("likes", "_id name pic")
    .sort('-createdAt')
    .then((myposts) => {
        res.json({myposts});
    })
    .catch((err) => {
        console.log(err);
    })
});

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes:req.user._id, usrLikes: req.user._id}
    }, {
        new: true
    })
    .populate("postedBy", "_id name pic")
    .populate("likes", "_id name pic")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err});
        }
        else{
            res.json(result);
        }
    })
});
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes:req.user._id, usrLikes : req.user._id}
    }, {
        new: true
    })
    .populate("postedBy", "_id name pic")
    .populate("likes", "_id name pic")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err});
        }
        else{
            res.json(result);
        }
    })
});
router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    };
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments:comment}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name pic")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err});
        }
        else{
            res.json(result);
        }
    })
});

router.delete('/deletepost/:postId',requireLogin, (req, res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .exec((err, post)=>{
        if(err || !post){
            return res.status(422).json({error:err});
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then((result)=> {
                res.json(result);
            }).catch(err=>{
                res.json({error:err});
            })            
        }
    })
});
router.delete('/deletecomment/:postId/comments/:commentId', requireLogin, (req, res) => {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .exec((err, post)=>{
        if(err || !post){
            return res.status(422).json({error:err});
        }
        post.comments.id(req.params.commentId).remove();
        post.save()
        .then(resp=>{
            res.json(resp);
        }).catch(err=>{
            res.json({error:err});
        })
    });
})


module.exports = router;

