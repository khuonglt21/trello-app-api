const teamService = require('../services/teamService');
const boardsService = require("../services/boardsService");


const createTeam = async (req, res) => {
    const {name} = req.body;
    if (!(name))
        return res.status(400).send({errMessage: 'name cannot be null'});

    await teamService.createTeam(req, (err, result) => {
        if (err) return res.status(500).send(err);
        result.__v = undefined;
        return res.status(201).send(result);
    });
};

const getTeams = async (req, res) => {
    const userId = req.user.id;
    await teamService.getTeams(userId, (err, result) => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(result);
    });
};


const createBoardInTeam = async (req, res) => {
    const {title, backgroundImageLink} = req.body;
    if (!(title && backgroundImageLink))
        return res.status(400).send({errMessage: 'Title and/or image cannot be null'});
    await teamService.createBoardInTeam(req, (err, result) => {
        if (err) return res.status(500).send(err);
        result.__v = undefined;
        return res.status(201).send(result);
    });
};



module.exports = {
    createTeam,
    getTeams,
    createBoardInTeam

};