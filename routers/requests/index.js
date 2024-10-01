const express = require('express');

const school_info = require('../../datas/school_info.json');
const { stringToNumber } = require('../../code/utils');
const { getUser, verifyPassword, changePassword } = require('../../code/users');
const { getRecordsDate, getRecordId, getRequestId } = require('../../code/database');

const router = express.Router();

router.get('/fetch_records', async (req, res) => {
    if (!req.query.date) res.status(400);

    if (req.query.date) {
        const date = new Date(req.query.date);
        if (date === "Invalid Date") res.status(400).send('Invalid date');

        const records = await getRecordsDate(new Date(req.query.date));

        res.status(200).send(JSON.stringify(records));
    }
})

router.get('/fetch_requests', async (req, res) => {
    if (!req.query.request_id) res.status(400);

    const request_id = stringToNumber(req.query.request_id);
    if (request_id === -1) {
        res.status(400).send();
        return;
    }

    const request = await getRequestId(request_id);
    if (!request) {
        res.status(400).send();
        return;
    }
    res.json(request);
});

router.get('/fetch_info', (req, res) => {
    res.status(200).send(school_info);
});

router.post('/change_password', async (req, res) => {
    //check if old password & new password is present
    if (!req.body.data.old_password || !req.body.data.new_password) res.status(400);

    //verify original password
    const user = await getUser(req.session.username);
    if (!user) res.status(400);
    if (!verifyPassword(req.body.data.old_password, user.password)) {
        res.status(400).send("Incorrect Password");
    }
    
    changePassword(req.session.username, req.body.data.new_password);
});

module.exports = {
    path: "/",
    permission: "student",
    router: router
};