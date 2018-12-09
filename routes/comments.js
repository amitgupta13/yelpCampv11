const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

router.get('/new',middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, (err, campground)=>{
        if(err) return console.log(err);
            res.render('comments/new', {campground:campground});
    });
});

router.post('/', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            return res.redirect('/campgrounds');
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash('error', 'Something went wrong');
                    console.log(err);           
                } 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully added a comment');
                    res.redirect(`/campgrounds/${campground._id}`);
            });
        }  
                

    });
});

router.get('/:commentId/edit', middleware.commentAuth, function(req, res){
    Comment.findById(req.params.commentId, function(err, comment){
        if(err) return redirect('back');
         res.render('comments/edit',{campgroundId:req.params.id, comment:comment});
    });
    
});

router.put('/:commentId', middleware.commentAuth, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
        if(err) return res.redirect('back');
            res.redirect(`/campgrounds/${req.params.id}`);
    });
});

router.delete('/:commentId', middleware.commentAuth, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err) return res.redirect('back');
            req.flash('success', 'Comment delelted');
            return res.redirect(`/campgrounds/${req.params.id}`);
    });
});

module.exports = router;