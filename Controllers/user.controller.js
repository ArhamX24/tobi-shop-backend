import User from "../Modals/user.modal.js"


let cookieOption = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
}

const signup = async (req,res) => {
  let {email} = req.body;
try{
    let existingUser = await User.findOne({email: email});
  
    if(existingUser){
      return res.send({result: false, message: "User Already Exists"});
    }
  
    let newUser = User(req.body);
    let token = await newUser.generateToken();
    let newUserData = await newUser.save();
  
    return res.cookie("Token", token, cookieOption).send({result: true, message: "Account Created", data: newUserData})

}catch(err){
    console.log(err);
}

}

const login = async (req,res) => {
  let data = req.body;

  try{
    let {email, password} = data
    let existingUser = await User.findOne({email: email})
    
    if(!existingUser){
        return res.send({result: false, message: "User Not Found"})
    }

    let userPassword = await existingUser.comparePassword(password);

    if(userPassword){
        let token = await existingUser.generateToken();

        return res.cookie("Token", token, cookieOption).send({result: true, message: "Login Success", data: existingUser})
    }else{
        return res.send({result: false, message: "Incorrect Password"})
    }
  }catch(err){
    console.log(err);
  }
}

const getUser = (req,res) => {
  return res.send({result: true, data: req?.user})
}

const updateUser = async (req,res) => {
  if(!req?.user){
    return res.send({result: false, message: "Not Authenticated"})
  }else{
    try{

    let userData = req?.user;
    let updatedData = req?.body;

    let updatedUserData = await User.findByIdAndUpdate(userData._id, updatedData, {new: true})

    return res.send({result: true, message: "User Updated", data: updatedUserData})
  }catch(err){
    return res.send({result: false, message: err.message})
  }
  }
}

const deleteUser = async (req,res) => {
  if(!req?.user){
    return res.send({result: false, message: "Not Authenticated 80 line"})
  }else{
    try{
      let userData = req?.user
      let deletedUser = await User.findByIdAndDelete(userData._id)
    return res.clearCookie("Token", cookieOption).send({result: true, message: "Account Deleted Successfully", data: deletedUser})
  }catch(err){
    res.send({result: false, message: err.message})
  }
  }
}

const logout =(req,res) => {
  if(!req?.user){
    return res.send({result: false, message: "Not Authenticated"})
  }else{
    try{
    return res.clearCookie("Token", cookieOption).send({result: true, message: "Logout Successfully"})
  }catch(err){
    res.send({result: false, message: err.message})
  }
  }
}




export {signup, login, updateUser, deleteUser, getUser, logout}