const jwt_decode = require('jwt-decode');
const userService = require('../services/userService')

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

module.exports = {
    uploadAvatarUser
}