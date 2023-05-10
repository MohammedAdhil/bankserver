// import db.js

const db=require("./db")


// import jsonwebtoken
const jwt=require('jsonwebtoken')

 
 
 
 
//  userDetails={
//     1000:{acno:1000,username:"anu",password:123,balance:0,transaction:[]},
//     1001:{acno:1001,username:"amal",password:123,balance:0,transaction:[]},
//     1002:{acno:1002,username:"arun",password:123,balance:0,transaction:[]},
//     1003:{acno:1003,username:"mega",password:123,balance:0,transaction:[]}
//   }

// login

login=(acno,psw)=>{
    
  return db.User.findOne({acno,password:psw}).then(user=>{
    if(user){
      const token=jwt.sign({currentAcno:acno},'secretkey123')
      return{
        statusCode:200,
        status:true,
        message:"login success",
        currentAcno:acno,
        currentUser:user.username,
        token
      }
    }
      else{
        return {
            statusCode:401,
            status:false,
            message:"incorrect acno or password"
  
        }
      }
  })

}



// register
register=(acno,uname,psw)=>{
  
 return db.User.findOne({acno}).then(user=>{
    if(user){
      return {
        statusCode:401,
        status:false,
        message:"user already exist"
      }
    }
    else{
      const newuser=new db.User({
        acno,
        username: uname,
        password: psw,
        balance: 0,
        transaction:[]})

        newuser.save()

        return {
          statusCode:200,
          status:true,
          message:"registration success"
        }
      }
  })


    // if(acno in userDetails)
    // {
    //   return {
    //     statusCode:401,
    //     status:false,
    //     message:"user already exist"
    //   }
    // }
    // else{
    //   userDetails[acno]={acno,username:uname,password:psw,balance:0,transaction:[]}
    //   return {
    //     statusCode:200,
    //     status:true,
    //     message:"registration success"
    //   }
    // }
  }

  // deposit

  deposit=(acno,password,amount)=>{
    var amnt=parseInt(amount)

    return db.User.findOne({acno,password}).then(user=>{
      if(user){
        user.balance+=amnt
        user.transaction.push({type:'CREDIT',amount:amnt})
        user.save()
        return {
          statusCode:200,
          status:true,
          message:`${user.balance}`
        }
      }
      else{
        return {
          statusCode:401,
          status:false,
          message: "incorrect acno or password"
        }
      }

      
    })

  }

  // withdraw

  withdraw=(acno,password,amount)=>{
    var amntt=parseInt(amount)

    return db.User.findOne({acno,password}).then(user=>{
      if(user){
        if(amntt>user.balance){
          return {
            statusCode:401,
            status:false,
            message: "insufficient balance"
          }

        }
        else{
          user.balance-=amntt
          user.transaction.push({type:'DEBIT',amount:amntt})
          user.save()
          return {
            statusCode:200,
            status:true,
            message:`${user.balance}`
          }
  

        }
        
       

      }
      else{
        return{
          statusCode:401,
          status:false,
          message:"incorrect acno or  password"
        }
      }

    })
  }
//     if(acno in userDetails){
//       if(password==userDetails[acno]["password"]){
//         if(amntt<=userDetails[acno]["balance"]){
//         userDetails[acno]["balance"]-=amntt
//         userDetails[acno]['transaction'].push({type:'DEBIT',amount:amntt})
 
//         return {
//           statusCode:200,
//           status:true,
//           message:userDetails[acno]["balance"]
//         }
//       }
//       else{
//         // alert('insufficient balance')
//         return {
//           statusCode:401,
//           status:false,
//           message: "insufficient balance"
//         }
//       }
//     }
//     else{
//       // alert('incorrect password')
     
//     }
//   }
//   else{
//     return{
//     statusCode:401,
//     status:false,
//     message: "incorrect acno"
//   }
// }

// }

// transaction

gettransaction=(acno)=>{
  return db.User.findOne({acno}).then(user=>{
    if(user){
      return{
        statusCode:200,
        status:true,
        message:user.transaction
      }
    }
    else{
      return{
        statusCode:401,
        status:false,
        message: "incorrect acno"
      }
    }
  })
  // if(acno in userDetails){
  //   return{
  //     statusCode:200,
  //     status:true,
  //     message:userDetails[acno]["transaction"]
  //   }
  // }
  // else{
  //   return{
  //     statusCode:401,
  //     status:false,
  //     message: "incorrect acno"
  //   }
  // }
}


// delete

acdelete=(acno)=>{
  return db.User.deleteOne({acno}).then(user=>{
    if(user){
      return {

        statusCode:200,
        status:true,
        message:"account deleted"
        

      }
    }
    else{
      return {
        statusCode:401,
        status:false,
        message:"incorrect acno"
      }
    }
  })
}



  module.exports={
    register,
    login,
    deposit,
    withdraw,
    gettransaction,
    acdelete
  }