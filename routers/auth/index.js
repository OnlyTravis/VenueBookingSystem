const express = require('express');
const router_student = express.Router();
const router_teacher = express.Router();

router_student.get('/*', (req, res, next) => {
    if (!req.session || !req.session.authorised || !req.session.username) {
        res.redirect('/login');
        return;
    }
    next();
});

router_teacher.get('/*', (req, res, next) => {
    if (!req.session || req.session.authorised != "teacher" || !req.session.username) {
        res.redirect('/home');
        return;
    }
    next();
});

module.exports = {
    auth_student: router_student,
    auth_teacher: router_teacher,
}