const mongoose = require('mongoose');
const Post = mongoose.model('Post');


module.exports = async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit); 
   
       const startIndex = (page - 1) * limit;
       const endIndex =  page*limit;
       
       Post.countDocuments({postedBy:{$in:req.user.following}}, async (err, result)=>{
           if(err){
               console.log(err);
           }
           else{
                const count = result;
                const results = {}
                results.totalCount = count;
                if(endIndex < count){
                    results.next = {
                        page:page + 1,
                        limit:limit
                    }
                }
                if(startIndex > 0){
                    results.previous = {
                        page:page - 1,
                        limit:limit
                    }
                }
                try{
                    results.results = await Post.find({postedBy:{$in:req.user.following}}).limit(limit).skip(startIndex).populate("postedBy", "_id name pic").populate("comments.postedBy", "_id name").populate("likes", "_id name pic").sort('-createdAt').exec();
                    res.paginatedResults = results;
                    next()
                }catch(e){
                    res.status(500).json({message:e.message})
                }
            }
        });
    };


 