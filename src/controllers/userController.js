const userModel = require("../Models/userModel");

const createUser = async function (req, res) {
  try {
    let data = req.body;
    if (!data) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter a valid data" });
    }
    if (["Mr", "Mrs", "Miss"].indexOf(data.title) == -1) {
      return res.status(400).send({
        status: false,
        data: "Enter a valid title Mr or Mrs or Miss ",
      });
    }
    if (!data.name) {
      return res
        .status(400)
        .send({ status: false, message: "Name is Missing" });
    }
    if (!data.phone) {
      return res
        .status(400)
        .send({ status: false, message: "Phone No. is Missing" });
    }
    if (!data.email) {
      return res
        .status(400)
        .send({ status: false, message: "Email Id is Missing" });
    }
    if (!data.password) {
      return res
        .status(400)
        .send({ status: false, message: "Password is Missing" });
    }
    let address = data.address;
    if (address) {
      if (!/^([a-zA-Z0-9#, ]+)$/.test(address.street)) {
        return res
          .status(400)
          .send({ status: false, message: "plz enter valid street" });
      }
      if (!/^([a-zA-Z]+)$/.test(address.city)) {
        return res
          .status(400)
          .send({ status: false, message: "plz enter valid city" });
      }
      if (!/^([0-9]{6})$/.test(address.pincode)) {
        return res
          .status(400)
          .send({ status: false, message: "plz enter valid pincode" });
      }
    }
   
    //console.log(data.name)
    //regex Syntex
    if (!/^([a-zA-Z ]+)$/.test(data.name)) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid name" });
    }
    if (!/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(data.phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Plz enter valid phone no." });
    }
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email)) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter a valid Email" });
    }
    if (!/^([a-zA-Z0-9!@#$%^&*_\-+=><]{8,15})$/.test(data.password)) {
      return res
        .status(400)
        .send({ status: false, message: "Plz enter valid Password, min 8 and mix 16 " });
    }
    
    //validation
    let checkUniqueData = await userModel.findOne({$or:[{phone: data.phone}, {email: data.email}]  });
    if (checkUniqueData) {
      if(checkUniqueData.phone == data.phone){
        return res.status(400).send({status:false, message: "Phone No.already exists"})
      }
      if(checkUniqueData.email == data.email){
        return res.status(400).send({status:false, message:"Email Id already exists"})
      }
    }
   
    
    let saved = await userModel.create(data);
    res.status(201).send({ status: true, message: "Success", data: saved });
  } catch (err) {
    console.log("This is the err", err.message);
    res.status(500).send({ status: false, massege: err.message });
  }
};

module.exports.createUser = createUser;
