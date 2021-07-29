const bcrypt = require("bcryptjs");


const hashing = async (value)=>{
    try{
        const salt = await bcrypt.genSalt(10)
        console.log("salt",salt)
        const hash = await bcrypt.hash(value,salt)
        console.log("hash",hash)
        return hash
    } catch(err) {
      return err
    }
}

const hashCompare = async (password,hashvalue) =>{
  try{
    return await bcrypt.compare(password,hashvalue)
  } catch (error){
    return error
  }
}

const createJWT = async({email, _id}) =>{
  try{
    return await JWT.sign({email,_id},secret,{expiresIn:"1h"})
  } catch(error){
    return error
  }
}

const authorize = async(req,res,next)=>{
  try{
    const bearerToken = await req.headers.authorization
    if(bearerToken){
      console.log("Allow users")
      next()
    } else{
      console.log("no token available")
      return res.sendStatus(403)
    }
  }catch(error){
   
  }
}

module.exports = { hashing, hashCompare, createJWT, authorize };


