const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const userLogin = async function (req, res) {
  try {
    let userEmail = req.body.email;
    if(!userEmail){
      return res.status(400).send({status:false, message:"Email Id is Missing"})
    }
    let userPassword = req.body.password;
    if(!userPassword){
      return res.status(400).send({status:false, message:"Password is Missing"})
    }
    // if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(userEmail.email)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "plz enter valid Email Id" });
    // }
    // if (
    //   !/^([a-zA-Z0-9!@#$%^&*_\-+=><]{8,16})$/.test(userPassword.password)
    // ) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Plz enter valid Password, min 8, max 15" });
    // }
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
        // iat:Math.floor(Date.now() / 100),
        // exp:Math.floor(Date.now() / 1000) + 60 + 60 + 60
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
