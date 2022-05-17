const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const userLogin = async function (req, res) {
  try {
    let userEmail = req.body.email;
    let userPassword = req.body.password;

    if (!userEmail || userEmail === undefined) {
      return res.status(400).send({ status: false, msg: "please enter email" });
    }
    // Password Validation
    if (!userPassword || userPassword === undefined) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter password" });
    }
    let isUser = await userModel.findOne({
      email: userEmail,
      password: userPassword,
    });
    if (!isUser) {
      return res
        .status(404)
        .send({ status: false, message: "PLZ ENTER Correct EMAILId AND PASSOWORD " });
    }
    let token = jwt.sign(
      {
        userId: isUser._id.toString(),
        
      },
      "project-3/group-37" , {expiresIn:'3600s'}
    );
    
       res.setHeader("x-api-key",token)
       
    res
      .status(201)
      .send({ status: true, message: "Success", data: { token: token } });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.userLogin = userLogin;
