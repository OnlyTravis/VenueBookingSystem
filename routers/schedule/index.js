const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {//booking record page
    res.render('schedule', {
        today: new Date(),
        role: req.session.authorised
    });
});

module.exports = {
    path: "/schedule",
    permission: "student",
    router: router
};