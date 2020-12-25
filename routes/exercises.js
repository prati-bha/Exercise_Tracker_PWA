const router = require('express').Router();
let Exercise = require('../models/exercise.model');
let User = require('../models/user.model');

const isUserAlreadyAvailable = async (username) => {
    let isUsernameAvailable = false;
    await User.find({ "username": username }, (err, users) => {
        if (users && users.length > 0) {
            isUsernameAvailable = true
        } else {
            isUsernameAvailable = false
        }
    });
    return isUsernameAvailable
}

router.route('/').get((req, res) => {
    let skip;
    const { limit, pageNum } = req.query;
    let limitNumeric;
    if (limit && pageNum) {
        skip = pageNum > 0 ? ((pageNum) * limit) : 0;
        limitNumeric = parseInt(limit);
    }

    Exercise.find().skip(skip).limit(limitNumeric).sort({ createdAt: -1 })
        .then(exercises => res.json(exercises))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const date = Date.parse(req.body.date);
    let validArray = [];
    isUserAlreadyAvailable(username).then((data) => {
        validArray.push(data);
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
    })

})
router.route('/:id').get((req, res) => {
    Exercise.findById(req.params.id)
        .then(exercise => res.json(exercise))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Exercise.findByIdAndDelete(req.params.id)
        .then(() => res.json('Exercise deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Exercise.findById(req.params.id)
        .then(exercise => {
            exercise.username = req.body.username;
            exercise.description = req.body.description;
            exercise.duration = Number(req.body.duration);
            exercise.date = Date.parse(req.body.date);

            exercise.save()
                .then(() => res.json('Exercise updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;