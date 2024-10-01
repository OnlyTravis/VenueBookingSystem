const express = require('express');
const { getRecordId, removeRecord, getRequestId, removeRequest, confirmRequest, rejectRequest, updateRecord } = require('../../code/database');
const { timeToString, stringToNumber } = require('../../code/utils');
const router = express.Router();

router.get('/*', async (req, res) => {//viewing a particular request
    //check if request_id in the url is valid
    const request_id = stringToNumber(req.url.replace("/",""));
    if (request_id === -1) {
        res.redirect('/profile');
        return;
    }

    const request = await getRequestId(request_id);
    if (!request) {
        res.redirect('/profile');
        return;
    }
    
    const record_1 = await getRecordId(request.record_id_1);
    record_1.from_time = timeToString(record_1.from_time);
    record_1.to_time = timeToString(record_1.to_time);
    var record_2;
    if (request.type === 2) {//change booking
        record_2 = await getRecordId(request.record_id_2);
        record_2.from_time = timeToString(record_2?.from_time);
        record_2.to_time = timeToString(record_2?.to_time);
    }
    
    res.render("view_request", {
        request: request,
        record_1: record_1,
        record_2: (request.type === 2)?record_2:false,
        role: req.session.authorised,
        can_remove: ((request.status === 0) && (request.author === req.session.username)),
    });
});

router.post('/*', async (req, res) => {
    if (!req.body.action) return;

    const request_id = stringToNumber(req.url.replace("/",""));
    if (request_id === -1) {
        res.status(400).send();
        return;
    }
    const request = await getRequestId(request_id);
    if (!request) {
        res.status(400).send();
        return;
    }

    switch (req.body.action) {
        case "remove_request" :
            if (request.author != req.session.username || request.status != 0) {
                res.status(400).send();
                return;
            }

            await removeRequest(request_id);
            if (request.type === 0) {
                await removeRecord(request.record_id_1);
            } else if (request.type === 2) {
                await removeRecord(request.record_id_2);
            }
            res.status(200).send();
            break;

        case "approve_request" :
            if (request.status != 0 || req.session.authorised != "teacher") {
                res.status(400).send();
                return;
            }

            await confirmRequest(request_id, req.session.username);

            switch (request.type) {
                case 0://create record
                    await updateRecord(request.record_id_1, {
                        visible: true
                    });
                    break;
                case 1://cancel booking
                    await updateRecord(request.record_id_1, {
                        visible: false
                    });
                    break;
                case 2://change record
                    await updateRecord(request.record_id_1, {
                        visible: false
                    });
                    await updateRecord(request.record_id_2, {
                        visible: true
                    });
                    break;
            }
            
            res.status(200).send();
            break;

        case "reject_request" :
            if (request.status != 0 || req.session.authorised != "teacher" || !req.body.reason) {
                res.status(400).send();
                return;
            }
            await rejectRequest(request_id, req.session.username, req.body.reason);
            
            res.status(200).send();
            break;
    }
})

module.exports = {
    path: "/view_request",
    permission: "student",
    router: router
};