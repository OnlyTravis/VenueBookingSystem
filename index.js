const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const PORT = 3000;

//setups
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'view'));

//middlewares
app.use(express.json());
app.use(session({
    secret : "secretusedtosigncookies",
    cookie : {
        sameSite : 'strict',
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

//Get Auth Routers
const { auth_student, auth_teacher }  = require('./routers/auth');

//load Routers
const router_folder = fs.readdirSync(path.join(__dirname, 'routers'));
const routers_all = [];
const routers_student = [];
const routers_teacher = [];
router_folder.forEach((folder_name) => {
    const router = require(`./routers/${folder_name}`);
    switch (router.permission) {
        case "none" :
            routers_all.push(router);
            break;
        case "student" :
            routers_student.push(router);
            break;
        case "teacher" :
            routers_teacher.push(router);
            break;
    }
})

//no permission needed(login logout)
routers_all.forEach((router) => {
    app.use(router.path, router.router);
})

//logged in users only pages
app.use('/*', auth_student);
routers_student.forEach((router) => {
    app.use(router.path, router.router);
})

//teacher only pages
app.use('/*', auth_teacher);
routers_teacher.forEach((router) => {
    app.use(router.path, router.router);
})

//open webserver
app.listen(PORT, () => {
    console.log(`Webserver opened on port ${PORT}!`)
})