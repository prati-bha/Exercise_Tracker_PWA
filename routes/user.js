const router = require('express').Router();
const validate = require('validator');
let User = require('../models/user.model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});
const sendResponse = (isUnique, res) => {
    if (isUnique) {
        res.status(200).send({
            message: "username can be taken !"
        });
    }
    if (!isUnique) {
        res.status(405).send({
            message: "username already taken"
        });
    }
}
const checkUniqueNess = (usernameToCheck, users, res) => {
    if (usernameToCheck === undefined) {
        res.status(400).send({
            message: 'username required'
        });
    }
    if (usernameToCheck !== undefined) {
        const usedUsernames = users.filter((user) => {
            if (usernameToCheck.toLowerCase() === user.username.toLowerCase()) {
                return user
            }
        });
        sendResponse(!(usedUsernames.length > 0), res);
    }
}
router.route('/username').get((req, res) => {
    const username = req.query.username;
    User.find()
        .then(users => {
            checkUniqueNess(username, users, res);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    if (username.length > 8) {
        res.status(400).send({
            message: "Allowed username's length is only 8"
        })
    } else if (!validate.isAlphanumeric(username, 'en-US')) {
        res.status(400).send({
            message: "Allowed username's content should be alphanumeric only"
        })
    }
    else {
        const newUser = new User({ username });
        newUser.save()
            .then(() => res.json('User added!'))
            .catch(err => res.status(400).json('Error: ' + err));
    }
});

module.exports = router;