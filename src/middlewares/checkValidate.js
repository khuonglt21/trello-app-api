const {body} = require('express-validator');

const validateLogin = () => {
    return [
        body('email', 'Invalid does not Empty').not().isEmpty(),
        body('email', 'Invalid email').isEmail(),
        body('password', 'password more than 6 degits').isLength({min: 6})
    ];
}
const validateRegisterUser = () => {
    return [
        body('name', 'name does not Empty').not().isEmpty(),
        body('name', 'name more than 3 degits').isLength({min: 3}),
        body('surname', 'surname does not Empty').not().isEmpty(),
        body('email', 'Invalid does not Empty').not().isEmpty(),
        body('email', 'Invalid email').isEmail(),
        body('password', 'password more than 6 degits').isLength({min: 6}),
        body('password', 'Invalid does not Empty').not().isEmpty(),

    ];
}

let validate = {
    validateLogin,
    validateRegisterUser
};

module.exports = {validate};