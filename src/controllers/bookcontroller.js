const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");

const mongoose = require("mongoose");

const createBooks = async function (req, res) {
  try {
    let data = req.body;
    if (!data) {
      return res
        .status(400)
        .send({ status: false, message: "Plz enter valid data" });
    }
    
    if (!data.title) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter title" });
    }
    if (!data.excerpt) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter excerpt" });
    }
    if (!data.userId) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter userid" });
    }
    if (!data.ISBN) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter ISBN NO" });
    }
    if (!data.category) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter category" });
    }
    if (!data.subcategory) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter subcategory" });
    }
    if (data.subcategory.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "subcategory is not valid" });
    }
    if (data.subcategory) {
      for (let i = 0; i < data.subcategory.length; i++) {
        if (!data.subcategory[i]) {
          return res
            .status(400)
            .send({ status: false, message: "subcategory is not valid" });
        }
      }
    }
    if (!data.isDeleted) {
      isDeleted = false;
    }
    deletedAt = null;
    if (!/^([a-zA-Z ]+)$/.test(data.title.trim())) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid title" });
    }
    if (!/^([a-zA-Z ]+)$/.test(data.excerpt.trim())) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid excerpt" });
    }
    if(!/^([0-9]{3})-([0-9]{10})$/.test(data.ISBN.trim())) {
      return res.status(400).send({status:false, message:"plz enter ISBN number" });
    }
    if (!/^([a-zA-Z ]+)$/.test(data.category.trim())) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid category" });
    }
    if (!/^([a-zA-Z ]+)$/.test(data.subcategory.trim())) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid subcategory" });
    }
    if (!/^([0-9]|10)$/.test(data.review)) {
      return res.status(400).send({
        status: false,
        message: "enter a number,that should be between 0-10",
      });
    }
   
  
    let checktitle = await bookModel.find({ title: data.title });
    if (checktitle.length !== 0) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid title" });
    }
    
    let user_id = await userModel.findById({ _id: data.userId });
    if (!user_id) {
      return res
        .status(400)
        .send({ status: false, message: "No such User  exsit" });
    }
    if(req.decodedToken.userId != data.userId){
      return res.status(404).send({status:false,message:"userId is not match"})
    }
    
    
    let checkISBN = await bookModel.find({ ISBN: data.ISBN });
    if (checkISBN.length !== 0) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid ISBN" });
    }
   
    let bookDoc = await bookModel.create(data);
    res.status(201).send({
      status: true,
      message: "New book created successfully",
      data: bookDoc,
    });
  } catch (err) {
    // console.log("This is the error 1", err.message)
    res.status(500).send({ status: false, data: err.message });
  }
};

const getBook = async function (req, res) {
  try {
    let query = req.query;
    console.log(query);
    let GetData = await bookModel
      .find({
        $and: [{ isDeleted: false, ...query }],
      }).collation({lacale:"en"})
      .sort({ title: 1 })
      .select({
        bookId: 1,
        title: 1,
        excerpt: 1,
        userId: 1,
        category: 1,
        subCategory:1,
        reviews: 1,
        releasedAt: 1,
      });

    if (GetData.length == 0) {
      return res.status(404).send({
        message: "No such document exist with the given attributes.",
      });
    }
    res.status(200).send({ status: true,message: 'Books list', data: GetData });
  } catch (err) {
    res.status(500).send({ status: false, data: err.message });
  }
};


const bookDetail = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    if (!mongoose.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid bookId" });
    }
    const data1 = req.body;
    console.log(data1);
    const details = await bookModel
      .findOne({
        _id: bookId,
        isDeleted: false,
      })
      .lean();
    console.log(details);
    if (!details) {
      return res
        .status(404)
        .send({ status: false, message: "Detalis is not present" });
    }
    const data2 = await reviewModel
      .find({
        bookId: details._id,
        isDeleted: false,
      })
      .select({
        _id: 1,
        bookId: 1,
        reviewedBy: 1,
        reviewedAt: 1,
        rating: 1,
        review: 1,
      });
    if (!data2) {
      return res
        .status(404)
        .send({ status: false, message: " Data not present" });
    }
    details.reviewsData = data2;

    res.status(200).send({ status: true, message: 'Books list',data: details });
  } catch (err) {
    // console.log("This is the error 1", err.message)
    res.status(500).send({ status: false, data: err.message });
  }
};

//DELETE /books/:bookId/review/:reviewId
const updateBook = async function (req, res) {
    try {
      const bookId = req.params.bookId;
      console.log(bookId);
      const details = req.body;
      if (!bookId) {
        return res
          .status(404)
          .send({ status: false, message: "plz enter a valid BookId" });
      }
      let checktitle = await bookModel.find({ title: details.title });
      if (checktitle.length != 0) {
        return res
          .status(404)
          .send({ status: false, message: "title already exsit" });
      } let checkexcerpt = await bookModel.find({ excerpt: details.excerpt });
      if (checkexcerpt.length != 0) {
        return res
          .status(404)
          .send({ status: false, message: "excerpt already exsit" });
      } let checkISBN = await bookModel.find({ ISBN: details.ISBN });
      if (checkISBN.length != 0) {
        return res
          .status(404)
          .send({ status: false, message: "ISBN already exsit" });
      }
      if (!(/^([a-zA-Z ]+)$/.test(details.title))) {
        return res
          .status(400)
          .send({ status: false, message: "plz enter valid title" });
      }
      if (!(/^([a-zA-Z ]+)$/.test(details.excerpt))) {
        return res
          .status(400)
          .send({ status: false, message: "plz enter valid excerpt" });
      }
      if(!(/^([0-9]{3})-([0-9]{10})$/.test(details.ISBN))) {
        return res.status(400).send({status:false, message:"plz enter ISBN number" });
      }
      if (!(details.title || details.excerpt || details.ISBN)) {
        return res
          .status(404)
          .send({ status: false, msg: "Plz enter valid keys for updation " });
      }
      if (details.userId || details.category || details.subcategory || details.review) {
        return res
          .status(404)
          .send({ status: false, msg: "you cant't change this attributes" });
      }
      
      const updateDetails = await bookModel.findOneAndUpdate(
        { _id: bookId },
        {$set:
          {title: details.title,
          excerpt: details.excerpt,
          ISBN: details.ISBN,
          releasedAt:Date()}
        },
        { new: true }
      );
      res.status(200).send({ status: true,message:"Book successfully update", data: updateDetails });
    } catch (err) {
      res.status(500).send({ status: false, message: err.message });
    }
  };


const deleteBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter a bookId" });
    }
    let book = await bookModel.findById(bookId);
    if (!book) {
      return res
        .status(400)
        .send({ status: false, message: "No such book exsits" });
    }
    if (book.isDeleted === true) {
      return res
        .status(404)
        .send({ status: false, message: "Book already deleted" });
    }
    let deleteBooks = await bookModel.findOneAndUpdate(
      { _id: bookId },
      { $set: { isDeleted: true , deletedAt: Date()} },
      { new: true }
    );
    res.status(200).send({ status: true,message:"Book successfully deleted",data: deleteBooks });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};


module.exports.bookDetail = bookDetail;
module.exports.createBooks = createBooks;
module.exports.getBook = getBook;
module.exports.updateBook = updateBook;
module.exports.deleteBook = deleteBook;
