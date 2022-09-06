const bcrypt = require("bcryptjs");
const userService = require("../services/userService");
const auth = require("../middlewares/auth");
const {validationResult} = require('express-validator');
const jwt_decode = require("jwt-decode");
const boardModel = require("../models/boardModel");
const teamService = require("../services/teamService");

const register = async (req, res) => {
    const {name, surname, email, password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({errMessage: errors.array()});
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;
    await userService.register(req.body, (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.status(201).send(result);
    });
};

const login = async (req, res) => {
    const {email, password} = req.body;
    //check validate Login
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({errMessage: errors.array()});
    }

    await userService.login(email, (err, result) => {
        if (err) return res.status(400).send(err);

        const hashedPassword = result.password;
        if (!bcrypt.compareSync(password, hashedPassword))
            return res
                .status(400)
                .send({errMessage: "Your email/password is wrong!"});

        result.token = auth.generateToken(result._id.toString(), result.email);
        result.password = undefined;
        result.__v = undefined;

        return res
            .status(200)
            .send({message: "User login successful!", user: result});
    });
};

const getUser = async (req, res) => {
    const userId = req.user.id;
    await userService.getUser(userId, (err, result) => {
        if (err) return res.status(404).send(err);

        result.password = undefined;
        result.__v = undefined;

        return res.status(200).send(result);
    });
};

const getUserWithMail = async (req, res) => {
    const {email} = req.body;
    await userService.getUserWithMail(email, (err, result) => {
        if (err) return res.status(404).send(err);
        const dataTransferObject = {
            name: result.name,
            surname: result.surname,
            color: result.color,
            email: result.email
        };
        return res.status(200).send(dataTransferObject);
    })
}
const checkUserByEmail = async (req, res) => {
    const email = req.params.email;
    let checkMail = false;
    await userService.getUserWithMail(email, (err, result) => {
        if (err) {
            return res.status(404).send({checkMail});
        } else {
            checkMail = true
            return res.status(200).send({checkMail});
        }

    })

}

const updateUser = async (req, res) => {
    const {name, surname, email, newPassword, password} = req.body;
    // console.log('123')
    // console.log(req.body)
    try {
        const token = req.headers.authorization.split(' ')[1]
        let decoded = jwt_decode(token);
        await userService.getUser(decoded.id, async (error, result) => {
            if (error) {
                return res.status(404).send(error);
            }
            const hashedPassword = result.password;
            if (!bcrypt.compareSync(password, hashedPassword)) {
                return res.status(400).send({
                    message: 'Invalid password'
                })
            }
            const salt = bcrypt.genSaltSync(10);
            const newPasswordBcrypt = bcrypt.hashSync(newPassword,salt)
            await userService.updateInfo(decoded.id, {name, surname, email, password:newPasswordBcrypt}, (error, result) => {
                if (error) {
                    return res.status(404).send(error);
                }
                return res.status(200).send({
                    message: 'User updated',
                    data: result
                });
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(404).send(error);
    }
}


const updateRoleUser = async (req, res) => {

    try{
        await userService.updateRoleUser(req, (err, result) => {
            if (err) return res.status(500).send(err);
            result.__v = undefined;
            return res.status(201).send(result);
        });
    }catch (error) {
        return res.status(404).send(error);
    }

}



module.exports = {
    register,
    login,
    getUser,
    getUserWithMail,
    checkUserByEmail,
    updateUser,
    updateRoleUser
};