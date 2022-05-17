const userModel = require("../Models/userModel")
const bookModel = require("../Models/bookModel")
const reviewModel = require("../Models/reviewModel")
const mongoose = require("mongoose")

const createReview = async function(req, res){
    try {
        const bookId = req.params.bookId
        const details = req.body
        if(!details){
            return res.status(400).send({status:false, Message:"plz enter bookId"})
        }
        if (!mongoose.isValidObjectId(bookId)) {
            return res
              .status(400)
              .send({ status: false, message: "plz enter valid bookId" });
          }
        const bookDetail = await bookModel.findOne({_id:bookId, isDeleted:false})
        if(!bookDetail){
            return res.status(400).send({status:false,message:"plz enter valid Id"})
        }
        const {reviews, rating, reviewedby}= details

        if(!reviews){
            return res.status(400).send({satus:false, message:"plz give a review"})
        }
        
        if(!rating){
            return res.status(400).send({status:false, message:"plz give a Rating"})
        }
        if(isNaN(rating) ){
            return res.status(400).send({status:false, message:"Plz give a rating only NO. 1-5"})
        }
        if(!/^([a-zA-Z ]+)$/.test(reviewedby)){
            return res.status(400).send({status:false, message:"Plz give a reviewedby"})
        }
        if(!/^([a-zA-Z ]+)$/.test(reviews.trim())){
            return res.status(400).send({status:false, message:"Plz give a valid review"})
        }
        if(rating<1){
            return res.status(400).send({status:false, message:"plz give rating min 1"})
        }
        if(rating>5){
            return res.status(400).send({status:false, massenge:"plz give a rating mix 5"})
        }
        details.bookId = bookId
        details.reviewedAt = new Date()

        const newReview = await reviewModel.create(details)
        const reviewCount = await bookModel.findOneAndUpdate({_id:bookId},{$inc:{reviews:1}},{new:true})
        res.status(201).send({status:true,message:"succes", data: newReview})
    } catch (err) {
        res.status(500).send({ status: false, data: err.message });
    }
}

    //PUT /books/:bookId/review/:reviewId
const updateReview = async function(req, res){
    try {
        const bookId = req.params.bookId
        if(!bookId){
            return res.status(400).send({status:false, message:"Plz enter bookId"})
        }
        const book = await bookModel.findOne({_id:bookId, isDeleted:false})
        if(!book){
            return res.status(400).send({status:false, message:" No such a Book"})
        }
        const reviewId = req.params.reviewId
        if(!reviewId){
            return res.status(400).send({status:false, message:"Plz enter reviewId"})
        }
        const reviewedData= req.body  
        const {reviews, rating, reviewedby}= reviewedData

        if(!/^([a-zA-Z ]+)$/.test(reviewedby)){
            return res.status(400).send({status:false, message:"Plz give a reviewedby"})
        }
        if(rating<1){
            return res.status(400).send({status:false, message:"plz give rating min 1"})
        }
        if(rating>5){
            return res.status(400).send({status:false, massenge:"plz give a rating mix 5"})
        } 

        const reviewss = await reviewModel.findOne({_id:reviewId, isDeleted:false})
        if(!reviewss){
            return res.status(400).send({status:false, message:"No such a review"})
        }
        const newReview = await reviewModel.findOneAndUpdate(
            {_id:reviewId },
            {$set:
                {reviews:reviewedData.reviews,
                rating:reviewedData.rating,
                reviewedby:reviewedData.reviewedby}
            },{new:true}
            );

            res.status(200).send({status:true,message:"review successfully update",data:newReview})
    } catch (err) {  
        res.status(500).send({ status: false, data: err.message });
    }
}
const deleteReview = async function(req,res){
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        if(!bookId){
            return res.status(400).send({status:false, message:"Plz enter bookId"})
        }
        if(!reviewId){
            return res.status(400).send({status:false, message:"plz enter reviewId"})
        }
        const book = await bookModel.findOne({_id:bookId, isDeleted:false})
        console.log(book)
        if(!book){
            return res.status(400).send({status:false, message:"Book not Found"})
        }
        const review = await reviewModel.findOne({_id:reviewId,isDeleted:false});
        console.log(review)
        if(!review){
            return res.status(400).send({status:false, message:"review not found"})
        }
        
        const deleteRev = await reviewModel.findOneAndUpdate(
            { _id:reviewId },
            { $set: { isDeleted: true , deletedAt: Date()} },
            { new: true }
          );
        const reviewCount = await bookModel.findByIdAndUpdate({_id:bookId},{$inc:{reviews:-1}},{new:true})
        res.status(200).send({status:true,message:"review successfully deleted",data:deleteRev})
    } catch (err) {
        res.status(500).send({ status: false, data: err.message });
    }
}


module.exports.createReview=createReview
module.exports.updateReview=updateReview
module.exports.deleteReview=deleteReview
