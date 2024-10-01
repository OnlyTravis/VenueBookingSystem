const express = require('express');
const router = express.Router();
const { addRecord, addRequest } = require('../../code/database');
const { rooms } = require('../../datas/school_info.json');
const { timeToNumber } = require('../../code/utils');

router.get('/', async (req, res) => {//booking record page
    res.render('book_venue', {
        today: new Date(),
        rooms: rooms,
        role: req.session.authorised,
    });
});

router.post('/', async (req, res) => {//add booking record
    console.log(req.session);
    if ((!req.body || !req.body.title || !req.body.description || !req.body.date || !req.body.from_time || !req.body.to_time || !req.body.room) || (req.session.authorised === "student" && !req.body.reason)) {
        res.render('profile', {
            today : new Date(),
            rooms : rooms
        });
    }

    const data = {
        author: req.session.username,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        from_time: timeToNumber(req.body.from_time),
        to_time: timeToNumber(req.body.to_time),
        room: req.body.room,
    }
    if (req.session.authorised === "teacher") {
        //add booking record(visible)
        await addRecord(data, true);
    } else {
        //add booking request
        const record = await addRecord(data, false);
        addRequest(data.author, req.body.reason, 0, 0, record.record_id);
    } 

    res.redirect('/my_requests');
});

module.exports = {
    path: "/book_venue",
    permission: "student",
    router: router
};