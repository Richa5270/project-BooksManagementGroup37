const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const userLogin = require("../controllers/loginController")
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController")
const auth = require("../Middleware/auth")


//signUp and login api
router.post("/register",userController.createUser)
router.post("/login",userLogin.userLogin)
//book api
router.post("/books",auth.authenti,bookController.createBooks)
router.get("/getData",auth.authenti,bookController.getBook)
router.get("/books/:bookId",auth.authenti,bookController.bookDetail)
router.put("/books/:bookId",auth.authenti,auth.authoriz,bookController.updateBook)
router.delete("/books/:bookId",auth.authenti,auth.authoriz,bookController.deleteBook)

//review
router.post("/books/:bookId/reviews",reviewController.createReview)
router.put("/books/:bookId/reviews/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/reviews/:reviewId",reviewController.deleteReview)

module.exports=router;

