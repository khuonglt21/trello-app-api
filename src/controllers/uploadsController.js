const jwt_decode = require('jwt-decode');
const userService = require('../services/userService')

const uploadAvatarUser = async(req,res)=>{
    console.log(req.headers);
    const token = req.headers.token
   let decoded = jwt_decode(token);
   await userService.uploadAvatar(decoded.id,req.file.filename,(err, result)=>{
        if(err){
            return res.status(400).send(err)
        }
        else{
            return res.status(200).send(result);
        }
    })
}

module.exports = {
    uploadAvatarUser
}