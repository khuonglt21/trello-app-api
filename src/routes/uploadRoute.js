const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const uploadsController = require('../controllers/uploadsController')
// SET STORAGE FOR AVATAR USERS
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/avatars')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage })

router.post("/avatar", upload.single("file"), (req, res) => {
    uploadsController.uploadAvatarUser(req,res)
});

//SET STORAGE FOR FILE IN CARDS
const cardStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        console.log(req.file)
        cb(null, 'src/public/cards')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + path.extname(file.originalname));
    }
});
const cardUpload = multer({ storage: cardStorage })
router.post("/cards/:cardId",cardUpload.single("file"), (req, res) => {
    uploadsController.uploadCardFile(req,res)
})



module.exports = router;