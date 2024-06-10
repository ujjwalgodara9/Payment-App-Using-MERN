const express=require('express');
const router=express.Router();

const {User,Account}=require("../db");

const { authMiddleware } = require('../middlewares');

const {default: db} = require('mongoose'); 



router.get("/balance",authMiddleware,async (req,res)=>{
    const account=await Account.findOne({userId:req.userId});
    res.json({balance:account.balance});
}
);

//much to learn here. making the transcation in one go using session
router.post("/transfer",authMiddleware,async (req,res)=>{
    const session=await db.startSession();
    session.startTransaction();

    const {amount,to}=req.body;

    const account=await Account.findOne({userId:req.userId}).session(session);

    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({message:"Insufficient balance"});
    }

    const toAccept=await Account.findOne({userId:to}).session(session);

    if(!toAccept){
        await session.abortTransaction();
        return res.status(400).json({message:"Invalid user"});
    }

    // await Account.updateOne({userId:req.userId},{balance:account.balance-amount}).session(session);
    // await Account.updateOne({userId:to},{balance:toAccept.balance+amount}).session(session);

    //this is more efficent as in this we do not have to fetch the account balance from database and can be done in one go
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();
    

    res.json({message:"Transfer successful"});
}
);

module.exports = router;