const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");
const bookModel = require("../Models/bookModel");


const authentication = async function (req, res, next){
    try {
        let token = req.headers['x-api-key']
        if(!token) {
            return res.status(401).send({status:false, data:"Token not present"});
        }
        let decodedToken = jwt.verify(token, "project-3/group-37")
        req.decodedToken = decodedToken; //req is our existing object{previous data , decodedtoken:{payload and issuedat}}
        next();
    } catch (err) {
      res.status(401).send({ status: false, message: err.message })
    }
}


let authorization = async function (req, res, next) {
    try {
      let decodedToken = req.decodedToken;
      let bookId = req.params.bookId;
      const isvalidId = await bookModel.findOne({_id:bookId,isDeleted:false});
      if (!isvalidId) {
        return res
          .status(404)
          .send({ status: false, data: "Please enter a valid bookId" });
      }
      // console.log(isvalidId);
      let UserToBeModified = isvalidId.userId.toString();
      let UserLoggedin = decodedToken.userId;
      if (UserToBeModified !== UserLoggedin) {
        return res
          .status(403)
          .send({
            status: false,
            message: "Author logged is not allowed to modify the requested authors data",
          });
      }
      let User = await userModel.findById(UserToBeModified);
      if (!User) {
        return res
          .status(404)
          .send({ status: false, data: "no such author exists" });
      }
      next();
    } catch (err) {
      res.status(500).send({ status: false, data: err.message });
    }
  };

  module.exports.authenti=authentication
  module.exports.authoriz=authorization