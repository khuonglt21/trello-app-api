const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const {validate} = require("../middlewares/checkValidate")

router.post("/register",validate.validateRegisterUser(), userController.register);
router.post("/login",validate.validateLogin(), userController.login);
router.get("/get-user", userController.getUser);
router.post("/get-user-with-email", userController.getUserWithMail);
router.get('/check-email/:email',userController.checkUserByEmail);
router.post('/user-update',userController.updateUser);
router.post('/user-update-role',userController.updateRoleUser);
router.get('/:idUser/get-two-board-recently',userController.getTwoBoardRecently);

module.exports = router;