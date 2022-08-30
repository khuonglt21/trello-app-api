const teamModel = require("../models/teamModel");
const userModel = require("../models/userModel");
const boardModel = require("../models/boardModel");

const createTeam = async (req, callback) => {
    try {
        const {name,description,members } = req.body;
        // Create and save new board
        let newTeam = new teamModel({ name, description});
        await newTeam.save();

        // Add this board to owner's boards
        const user = await userModel.findById(req.user.id);
        user.teams.unshift(newTeam.id);
        await user.save();

        // Add user to members of this board
        let allMembers = [];
        allMembers.push({
            user: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            color: user.color,
            role: 'owner',
        });

        // Save newBoard's id to boards of members and,
        // Add ids of members to newBoard
        await Promise.all(
            members.map(async (member) => {
                const newMember = await userModel.findOne({ email: member.email });
                newMember.teams.push(newTeam._id);
                await newMember.save();
                allMembers.push({
                    user: newMember._id,
                    name: newMember.name,
                    surname: newMember.surname,
                    email: newMember.email,
                    color: newMember.color,
                    role: 'member',
                });
                //Add to board activity
                // newBoard.activity.push({
                //     user: user.id,
                //     name: user.name,
                //     action: `added user '${newMember.name}' to this board`,
                // });
            })
        );

        // Add created activity to activities of this board
        // newBoard.activity.unshift({ user: user._id, name: user.name, action: 'created this board', color: user.color });

        // Save new board
        newTeam.members = allMembers;
        await newTeam.save();

        return callback(false, newTeam);
    } catch (error) {
        return callback({
            errMessage: 'Something went wrong',
            details: error.message,
        });
    }
};

const getTeams = async (userId, callback) => {
    try {
        // Get user
        const user = await userModel.findById(userId);

        // Get board's ids of user
        const teamIds = user.teams;

        // Get boards of user
        const teams = await teamModel.find({ _id: { $in: teamIds } }).sort({name: -1});
        // const boards = await boardModel.find();

        // Delete unneccesary objects
        // boards.forEach((board) => {
        //     board.activity = undefined;
        //     board.lists = undefined;
        // });

        return callback(false, teams);
    } catch (error) {
        return callback({ msg: 'Something went wrong', details: error.message });
    }
};

const createBoardInTeam = async (req, callback) => {
    try {
        const { title, backgroundImageLink, members, isImage,idTeam } = req.body;
        // Create and save new board
        let newBoard = new boardModel({ title, backgroundImageLink, isImage });
        newBoard.teams=idTeam;

        await newBoard.save();
        // Add this board to owner's boards
        const user = await userModel.findById(req.user.id);
        user.boards.unshift(newBoard.id);

        const team = await teamModel.findById({_id:idTeam})
        team.boards.push(newBoard.id);
         await user.save();
         await team.save();


        // Add user to members of this board
        let allMembers = [];
        allMembers.push({
            user: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            color: user.color,
            role: 'owner',
        });

        // // Save newBoard's id to boards of members and,
        // // Add ids of members to newBoard
        await Promise.all(
            members.map(async (member) => {
                const newMember = await userModel.findOne({ email: member.email });
                newMember.boards.push(newBoard._id);
                await newMember.save();
                allMembers.push({
                    user: newMember._id,
                    name: newMember.name,
                    surname: newMember.surname,
                    email: newMember.email,
                    color: newMember.color,
                    role: 'member',
                });
                //Add to board activity
                // newBoard.activity.push({
                //     user: user.id,
                //     name: user.name,
                //     action: `added user '${newMember.name}' to this board`,
                // });
            })
        );

        // // Add created activity to activities of this board
        // newBoard.activity.unshift({ user: user._id, name: user.name, action: 'created this board', color: user.color });
        //
        // // Save new board
        team.members = allMembers;
        await team.save();

        return callback(false, newBoard);
    } catch (error) {
        return callback({
            errMessage: 'Something went wrong',
            details: error.message,
        });
    }
};




module.exports = {
    createTeam,
    getTeams,
    createBoardInTeam
};