const userModel = require("../models/userModel");
const teamModel = require("../models/teamModel");
const boardModel = require("../models/boardModel");
const {createRandomHexColor} = require("./helperMethods");

const register = async (user, callback) => {
    let userfind = await userModel.findOne({email: user.email});
    if (userfind) {
        return callback({errMessage: "Email already in use!", details: ""});
    }
    const newUser = new userModel({...user, color: createRandomHexColor()});

    const newTeam = new teamModel({
        name: "Trello Workspaces",
        members: [{
            user: newUser._id,
        }]
    })
    newUser.teams = newTeam._id;
    newUser.defaultTeam = newTeam._id;
    await newTeam.save();


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
        if (!user) return callback({errMessage: "Your email/password is wrong!"});
        return callback(false, {...user.toJSON()});
    } catch (err) {
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

const uploadAvatar = async (userId, avatar, callback) => {
    try {
        let user = await userModel.findOneAndUpdate({_id: userId}, {avatar: avatar});

        if (!user) {
            return callback(true, {Message: 'User not found'})
        } else {
            // console.log('789')
            return callback(false, {
                message: "user already exists",
                user
            })
        }
    } catch (e) {
        return callback(true, {
            errMessage: "Something went wrong",
            details: e.message,
        });
    }
}

const updateInfo = async (userId, userInfo, callback) => {
    const {name, surname, email, password} = userInfo;
    console.log(email)
    console.log(password)
    try {
        let user = await userModel.findOneAndUpdate({_id: userId}, {name, surname, email, password: password});
        if (!user) {
            return callback(true, {Message: 'User not found'})
        } else {
            return callback(false, {
                message: "user already exists",
                user
            })
        }

    } catch (e) {
        return callback({
            errMessage: "Something went wrong,can't update",
            details: e.message,
        })
    }
}

const updateRoleUser = async (req, callback) => {
    try {
        const {role, idMember, idBoard} = req.body

        const board = await boardModel.findById(idBoard)

        board.members = board.members.map(member => {
            if (member._id.toString() === idMember) {
                member.role = role
            }
            return member
        })

        await board.save();

        return callback(false, {
            message: "roleUser changed successfully",
        })

    } catch (error) {
        return callback({
            errMessage: 'Something went wrong',
            details: error.message,
        });
    }
}


const getTwoBoardRecently = async (req, callback) => {
    try {
        const idUser = req.params.idUser
        const user = await userModel.findById(idUser)
        const idBoard = user.boards;
        const boards = await boardModel
            .find({ _id: { $in: idBoard } })
            .collation({'locale':'en'})
            .sort({createdAt: -1})
            .limit(2)
        console.log(boards)
        return callback(false, boards)
    } catch (error) {
        return callback({
            errMessage: 'Something went wrong',
            details: error.message,
        });
    }
}


module.exports = {
    register,
    login,
    getUser,
    getUserWithMail,
    uploadAvatar,
    updateInfo,
    updateRoleUser,
    getTwoBoardRecently
};