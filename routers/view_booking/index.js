const express = require('express');
const { getRecordId, confirmRequest, updateRecord, getRequestsAuthor, addRequest, addRecord } = require('../../code/database');
const { rooms } = require('../../datas/school_info.json');
const { timeToString, stringToNumber, timeToNumber } = require('../../code/utils');
const router = express.Router();

router.get('/*', async (req, res) => {//viewing a particular record
    //check if record_id in the url is valid
    const record_id = stringToNumber(req.url.replace("/",""));
    if (record_id === -1) {
        res.redirect('/profile');
        return;
    }

    const record = await getRecordId(record_id)
    if (!record || !record.visible) {
        res.redirect('/profile');
        return;
    }

    record.from_time = timeToString(record.from_time);
    record.to_time = timeToString(record.to_time);

    //check user can edit the record
    var can_edit = (req.session.authorised === "teacher") || (req.session.username === record.author) 
    if (can_edit) {
        const requests = await getRequestsAuthor(req.session.username);
        for (let i = 0; i < requests.length; i++) {
            //check if a request has already been made by the user
            if (requests[i].record_id_1 === record_id && requests[i].status === 0) {
                can_edit = false;
                break;
            }
        }
    }

    res.render("view_booking", {
        record: record,
        role: req.session.authorised,
        rooms: rooms,
        can_edit: can_edit
    });
});

router.post('/*', async (req, res) => {
    if (!req.body.action) return;

    const record_id = stringToNumber(req.url.replace("/",""));
    if (record_id === -1) {
        res.status(400).send();
        return;
    }
    const record = await getRecordId(record_id);
    if (!record) {
        res.status(400).send();
        return;
    }

    //check if user has permission to change record
    var can_edit = (req.session.authorised === "teacher") || (req.session.username === record.author) 
    if (can_edit) {
        const requests = await getRequestsAuthor(req.session.username);
        for (let i = 0; i < requests.length; i++) {
            //check if a request has already been made by the user
            if (requests[i].record_id_1 === record_id && requests[i].status === 0) {
                can_edit = false;
                break;
            }
        }
    }
    if (!can_edit) {
        res.status(400).send();
        return;
    }

    switch (req.body.action) {
        case "change_booking":
            if (!req.body.data || !req.body.data.title || !req.body.data.description || !req.body.data.room || !req.body.data.at || !req.body.data.from_time || !req.body.data.to_time || !req.body.data.reason) {
                res.status(400).send();
                return;
            }
            console.log(req.body)
            const data = {
                author: req.session.username,
                title: req.body.data.title,
                description: req.body.data.description,
                date: req.body.data.at,
                from_time: timeToNumber(req.body.data.from_time),
                to_time: timeToNumber(req.body.data.to_time),
                room: req.body.data.room,
            }

            if (req.session.authorised === "teacher") {
                const new_record = await addRecord(data, true);
                await updateRecord(record_id, {
                    visible: false
                });
                const request = await addRequest(data.author, req.body.reason, 2, 2, record.record_id, new_record.record_id);
                await confirmRequest(request.request_id, req.session.username);
            } else {
                const new_record = await addRecord(data, false);
                await addRequest(data.author, req.body.reason, 2, 0, record.record_id, new_record.record_id);
            }
        
            res.status(200).send();
            break;
        case "cancel_booking":
            if (!req.body.reason) {
                res.status(400).send();
                return;
            }

            if (req.session.authorised === "teacher") {
                await updateRecord(record_id, {
                    visible: false
                });
                const request = await addRequest(req.session.username, req.body.reason, 1, 2, record.record_id);
                await confirmRequest(request.request_id, req.session.username);
            } else {
                await addRequest(req.session.username, req.body.reason, 1, 0, record.record_id);
            }

            res.status(200).send();
            break;
    }
})

module.exports = {
    path: "/view_booking",
    permission: "student",
    router: router
};