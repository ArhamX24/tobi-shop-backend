import jwt from "jsonwebtoken"
import User from "../Modals/user.modal.js";


let auth = async (req,res,next) => {

  let token = req?.cookies?.Token;

  try{
    if(!token){
      return res.send({result: false, message: "Not Authenticated"})
    }

    let tokenData = jwt.verify(token, process.env.SECRET_KEY)

    if(tokenData){
      let userData = await User.findOne({email: tokenData.email});
      req.user = userData;
      next()
    }else{
      return res.send({result: false, message: "Not Authenticated"})
    }


  }catch(err){
    res.send({result: false, message: err.message})
  }
}

export default auth
