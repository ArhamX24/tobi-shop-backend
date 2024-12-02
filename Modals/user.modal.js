import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

let {Schema, model} = mongoose

let UserSchema = new Schema({
    username: {type: String, min: [2, "invalid username"]},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true, min: [8, "password is too short"]},
    phNumber: {type: Number},
});

UserSchema.pre("save", async function(next){
    let user = this;

    if(!user.isModified('password')){
        return next()
    }
    try{
        let salt = await bcrypt.genSalt(10);
        let hashedPass = await bcrypt.hash(user.password, salt)
        user.password = hashedPass
        next()
    }catch(err){
        console.log(err);
    }
})

UserSchema.methods.comparePassword = async function (userPassword) {
    let res = await bcrypt.compare(userPassword, this.password)
    return res
}

UserSchema.methods.generateToken = function(){
    let user = this;
    let token = jwt.sign({email: user.email, password: user.password}, process.env.SECRET_KEY,);
    return token
}

let User = model("User", UserSchema)

export default User