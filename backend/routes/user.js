const express=require('express');

const router=express.Router();
const zod=require('zod');
const jwt=require('jsonwebtoken');
const {User,Account}=require("../db");
const {JWT_SECRET}=require("../config");
const { authMiddleware } = require('../middlewares');


const signupSchema=zod.object({
    username:zod.string().email(),
    firstname:zod.string().min(3).max(255),
    lastname:zod.string().min(3).max(255),
    password:zod.string().min(6).max(1024)
});

const UpdateBody=zod.object({
    firstname:zod.string().min(3).max(255).optional(),
    lastname:zod.string().min(3).max(255).optional(),
    password:zod.string().min(6).max(1024).optional()
});

const signinSchema=zod.object({
    username:zod.string().email(),
    password:zod.string().min(6).max(1024)
});

router.post("/signup",async (req,res)=>{
    const body=req.body;

    const {success}=signupSchema.safeParse(body);

    if(!success){
        return res.status(400).json({message:"Invalid data"});
    }

    const existinguser=await User.findOne({username:body.username});

    if(existinguser){
        return res.status(400).json({message:"Username already exists"});
    }

    const dbuser=await User.create(
        {
            username:body.username,
            password:body.password,
            firstName:body.firstname,
            lastName:body.lastname
        }
    );

    const userId=dbuser._id;

    const accountbal=await Account.create({
        userId,
        balance:1+Math.random()*10000
    });
    
    const token=jwt.sign({userId:userId},JWT_SECRET);
    res.json({
        message:"User created",
        token:token
    });
    })

router.put("/",authMiddleware,async (req,res)=>{
    const {success}=UpdateBody.safeParse(req.body);
    if(!success){
        return res.status(400).json({message:"Invalid data while updatying"});
    }

    await User.updateOne({_id:req.userId},req.body);
    res.json({message:"User updated"});
}
);


router.post("/signin",async (req,res)=>{
    const body=req.body;

    const {success}=signinSchema.safeParse(body);

    if(!success){
        return res.status(400).json({message:"Invalid data"});
    }

    const {username,password}=body;
    const dbuser=await User.findOne({username});

    if(!dbuser){
        return res.status(400).json({message:"Invalid username"});
    }

    if(dbuser.password!==password){
        return res.status(400).json({message:"Invalid password"});
    }

    const token=jwt.sign({userId:dbuser._id},JWT_SECRET);
    res.json({
        message:"User signed in",
        token:token
    });
});


router.get("/bulk",async (req,res)=>{

    const filter=req.query.filter || "";
    const users=await User.find({
        //this or helps in getting if any of the first or last name has that substring
        $or:[{

            //return a substring present in the firstName
            firstName:{
                "$regex":filter
            }
        },{
                lastName:{
                    "$regex":filter
                }
            
        }]
    })

    res.json({
        user:users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
});


module.exports=router;