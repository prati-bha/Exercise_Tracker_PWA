const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Exercise = require("../models/exercise.model");

const userOneId = mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    email: "user.one@test.com",
    password: "test123",
    username: 'userTwo',
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
        }
    ]
};

const userTwoId = mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    email: "user.two@test.com",
    password: "test123",
    username: 'userOne',
    tokens: [
        {
            token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
        }
    ]
};

const exerciseOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First exercise",
    username: 'userOne',
    duration: '1234',
    date: new Date(),
};

const exerciseTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Second exercise",
    username: 'userTwo',
    duration: '1234',
    date: new Date(),
};



const setupDatabase = async () => {
    await User.deleteMany();
    await Exercise.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Exercise(exerciseOne).save();
    await new Exercise(exerciseTwo).save();
};

module.exports = {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    exerciseOne,
    exerciseTwo,
    setupDatabase
};
