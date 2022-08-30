const jwt_decode = require('jwt-decode');
const userService = require('../services/userService')
const cardService = require('../services/cardService')
const uploadAvatarUser = async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        let decoded = jwt_decode(token);
        await userService.uploadAvatar(decoded.id,req.file.filename,(err,result)=>{
            if(err){
                return res.status(400).send(err.message)
            }
                return res.status(200).send(result);
        })
    }catch(e){
        console.log(e.message);
    }
}

const uploadCardFile = async(req,res) => {
    try{
        const cardId = req.params.cardId;
        await cardService.uploadFile(cardId,req.file.filename,(err,result)=>{
            if(err){
                return res.status(400).send(err.message)
            }
            return res.status(200).send(result);
        })
    }catch(err){
        console.log(err.message);
    }
}


module.exports = {
    uploadAvatarUser,
    uploadCardFile
}