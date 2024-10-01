const express = require('express');
const { getRequests, getRecordId } = require('../../code/database');
const router = express.Router();

router.get('/', async (req, res) => {//viewing all requests
    const requests = await getRequests();
    const records = [];
    for (const request of requests) {
        const record = await getRecordId(request.record_id_1);
        records.push(record)
    }
    
    res.render('pending_requests', {
        requests: requests,
        records: records,
        role: req.session.authorised,
    });
})

module.exports = {
    path: "/pending_requests",
    permission: "teacher",
    router: router
};