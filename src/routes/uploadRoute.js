const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const uploadsController = require('../controllers/uploadsController')
// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/avatars')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage })

router.post("/avatar", upload.single("file"), (req, res) => {
    uploadsController.uploadAvatarUser(req,res)
});

module.exports = router;