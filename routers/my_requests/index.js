const express = require('express');
const { getRequestsAuthor, getRecordId } = require('../../code/database');
const router = express.Router();

router.get('/', async (req, res) => {//viewing all requests
    const requests = await getRequestsAuthor(req.session.username);
    const records = [];
    for (const request of requests) {
        const record = await getRecordId(request.record_id_1);
        records.push(record)
    }

    res.render("my_request", {
        requests: requests,
        records: records,
        role: req.session.authorised,
    });
});

module.exports = {
    path: "/my_requests",
    permission: "student",
    router: router
};