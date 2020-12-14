const router = require('express').Router();
let Exercise = require('../models/exercise.model');
const auth = require('../middlewares/auth')
// let User = require('../models/user.model');

const checkUsername = (username) => {
    if (username === null || username === undefined) {
        return false
    }
    return true
}
/**
 * No Need right now.
 */
// const isUserAlreadyAvailable = async (username) => {
//     let isUsernameAvailable = false;
//     await User.find({ "username": { $regex: username, $options: 'i' } }).countDocuments((err, count) => {
//         if (err) {
//             res.status(500);
//         }
//         if (!err) {
//             isUsernameAvailable = count > 0;
//         }
//     });
//     return isUsernameAvailable
// }

router.get('/', auth, async (req, res) => {
    let skip;
    const { username } = req.user;
    const { limit, pageNum } = req.query;
    let limitNumeric;
    if (limit && pageNum) {
        skip = pageNum > 0 ? ((pageNum) * limit) : 0;
        limitNumeric = parseInt(limit);
    }
    const isUsernameAdded = checkUsername(username);
    if (isUsernameAdded) {
        Exercise.find({ username }).skip(skip).limit(limitNumeric).sort({ createdAt: -1 })
            .then(exercises => res.json(exercises))
            .catch(err => res.status(400).json('Error: ' + err));
    } else {
        res.status(400).send({
            message: "Add Username First"
        })
    }

});

router.post('/add', auth, (req, res) => {
    const username = req.user.username;
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const date = Date.parse(req.body.date);
    let validArray = [];
    const isUsernameAdded = checkUsername(username);
    validArray.push(description.length <= 250);
    if (isUsernameAdded) {
        validArray.push(description.length <= 250);
        if (validArray.every((element) => element === true)) {
            const newExercise = new Exercise({
                username,
                description,
                duration,
                date,
            });

            newExercise.save()
                .then(() => {
                    if (req.subscription !== null) {
                        const payload = JSON.stringify({
                            title: 'User Logged The Exercise',
                            body: "You have successfully logged your exercise",
                            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBB4ELRwTrxy6lKCQJe9Q5ez9nIEqQHE-xRg&usqp=CAU"
                        });
                        req.webPush.sendNotification(req.subscription.body, payload)
                            .catch(error => console.error(error));
                    }
                    res.json('Exercise added!')
                })
                .catch(err => res.status(400).json('Error: ' + err));
        } else {
            res.status(400).send({
                message: "Invalid Input"
            })
        }
    } else {
        res.status(400).send({
            message: "Add Username First"
        })
    }
})

router.get('/:id', auth, (req, res) => {
    const isUsernameAdded = checkUsername(req.user.username);
    if (isUsernameAdded) {
        Exercise.findById(req.params.id)
            .then(exercise => res.json(exercise))
            .catch(err => res.status(400).json('Error: ' + err));
    } else {
        res.status(400).send({
            message: "Add Username First"
        })
    }
});

router.delete('/:id', auth, (req, res) => {
    const isUsernameAdded = checkUsername(req.user.username);
    if (isUsernameAdded) {
        Exercise.findByIdAndDelete(req.params.id)
            .then(() => res.json('Exercise deleted.'))
            .catch(err => res.status(400).json('Error: ' + err));
    } else {
        res.status(400).send({
            message: "Add Username First"
        })
    }
});

router.post('/update/:id', auth, (req, res) => {
    const isUsernameAdded = checkUsername(req.user.username);
    if (isUsernameAdded) {
        Exercise.findOne({ username: req.user.username, _id: req.params.id }, function (err, exercise) {

            if (err) {
                res.status(400).json('Error: ' + err);
            } else {
                req.body.description && (exercise.description = req.body.description),
                    req.body.duration && (exercise.duration = Number(req.body.duration)),
                    req.body.date && (exercise.date = Date.parse(req.body.date))
                exercise.save(function (err) {
                    if (err) {
                        console.error('ERROR!');
                    } else {
                        res.json('Exercise updated!')
                    }
                });
            }
        })
    } else {
        res.status(400).send({
            message: "Add Username First"
        })
    }

});

module.exports = router;