const db = require('mongoose')

db.connect("mongodb://localhost:27017/paytm")

const userSchema=new db.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },password:{
        type:String,
        required:true,
        minLength:6},
    firstName:{
        type:String,
        required:true,
        maxLength:50,
        trim:true},
    lastName:{
        type:String,
        required:true,
        maxLength:50,
        trim:true}
});

const accountSchema=new db.Schema({
    userId:{
        type:db.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});

const User=db.model("user",userSchema)
const Account=db.model("account",accountSchema)

module.exports={
    User,Account
}