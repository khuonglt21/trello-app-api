const userModel = require("../models/userModel");
const {createRandomHexColor} = require("./helperMethods");

const register = async (user, callback) => {
    let userfind = await userModel.findOne({email: user.email});
    if(userfind) return callback({errMessage: "Email already in use!", details: ""});

    const newUser = new userModel({...user, color: createRandomHexColor()});
    await newUser
        .save()
        .then((result) => {
            return callback(false, {message: "User created successfuly!"});
        })
        .catch((err) => {
            return callback({errMessage: "Something went wrong!", details: err});
        });
};

const login = async (email, callback) => {
    try {
        let user = await userModel.findOne({email});
        console.log(user)
        if (!user) return callback({errMessage: "Your email/password is wrong!"});
        return callback(false, {...user.toJSON()});
    } catch (err) {
        console.log(err.message);
        return callback({
            errMessage: "Something went wrong",
            details: err.message,
        });
    }
};

const getUser = async (id, callback) => {
    try {
        let user = await userModel.findById(id);
        if (!user) return callback({errMessage: "User not found!"});
        return callback(false, {...user.toJSON()});
    } catch (err) {
        return callback({
            errMessage: "Something went wrong",
            details: err.message,
        });
    }
};

const getUserWithMail = async (email, callback) => {
    try {
        let user = await userModel.findOne({email});
        if (!user)
            return callback({
                errMessage: "There is no registered user with this e-mail.",
            });
        return callback(false, {...user.toJSON()});
    } catch (error) {
        return callback({
            errMessage: "Something went wrong",
            details: error.message,
        });
    }
};

module.exports = {
    register,
    login,
    getUser,
    getUserWithMail,
};