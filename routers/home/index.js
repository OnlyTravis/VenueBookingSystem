const express = require('express');
const { getRequestsNotification, getRecordId } = require('../../code/database');
const router = express.Router();

router.get('/', async (req, res) => {
    const requests = await getRequestsNotification(req.session.username);
    
    const records = [];
    for (const request of requests) {
        const record = await getRecordId(request.record_id_1);
        records.push(record);
    }

    res.render('home', {
        username: req.session.username,
        requests: requests,
        records: records,
        role: req.session.authorised,
    });
});

module.exports = {
    path: "/home",
    permission: "student",
    router: router
};