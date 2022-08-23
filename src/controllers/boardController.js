const boardService = require('../services/boardService');



const getById = async (req, res) => {
    // Validate whether params.id is in the user's boards or not
    const validate = req.user.boards.filter((board) => board === req.params.id);
    if (!validate)
        return res.status(400).send({ errMessage: 'You can not show the this board, you are not a member or owner!' });

    // Call the service
    await boardService.getById(req.params.id, (err, result) => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(result);
    });
};



module.exports = {getById}