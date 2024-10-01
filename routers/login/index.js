const express = require('express');
const { getUser, verifyPassword } = require('./../../code/users')
const router = express.Router();


router.get('/', (req, res) => {
    if (req.session.authorised) {
        res.redirect('/home');
    } else {
        res.render('login', {text : ''});
    }
})

router.post('/', async (req, res) => {
    //get username & password entered from http request
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('login', {text : "Invalid Username or Password."})
        return;
    }

    //get user object from username
    const user = await getUser(username);
    if (!user) {
        res.render('login', {text : "Incorrect Username or Password."})
        return;
    }

    //check if password matches
    if (!verifyPassword(password, user.password)) {
        res.render('login', {text : "Incorrect Username or Password."})
        return;
    }

    //set session cookies
    req.session.username = user.username;
    req.session.authorised = user.permission === 1?"teacher":"student"
    res.redirect('/home');
});

module.exports = {
    path: "/login",
    permission: "none",
    router: router
};