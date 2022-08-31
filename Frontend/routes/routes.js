const { request } = require("express");
const { fileURLToPath } = require("url");
const expressSession = require('express-session');
const { Console } = require("console");
const bcrypt = require('bcryptjs');
const { title } = require("process");


const gateway = 'localhost:8888';

const videoService = `${gateway}/videos/`;
//[GET] single entry {id}
//[DELETE] del    /
//[PUT]    edit   /
const getAllVideos = 'allvideos'
const searchAllVideos = 'search'
const updateVideo = 'update'
const addVideo = 'create'

//[GET]    get single entry {id}
//[DELETE] del    /
//[PUT]    edit   /
const getAllUser = 'allusers';
const searchUser = 'search/';
const addUser = 'create';
const userService = `${gateway}/users/`;

let currentUsername = '';
let currentUserID = '';

// Creates the create user page
exports.create = (req, res) => {
    res.render('create', {
        title: ''
    });
};

// Stores the data from the create user page
//TODO: encrypt password+user
exports.createUser = async (req, res) => {
    postUrl = `${userService}${addUser}`;
    const salt = bcrypt.genSaltSync(10);
    const hashUsername = bcrypt.hashSync(req.body.username, salt);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    try {
        const response = await fetch(postUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            username: hashUsername,
            password: hashPassword
            })
        });
        const data = await response.json();
        console.log(data);

        console.log(req.body.username + ' added');
        res.redirect('/login'); 

        } catch(err) {
        console.log(`Something went wrong, user not created: ${err}`)
        res.redirect('/error')
        } 

}


//index reference
exports.settings = async (req, res) => {
    //
    //const filteredDocs = fetch user from api 

    res.render('settings', {
        title: 'Welcome',
        users: filteredDocs
    });
};


//Loads the login page
exports.login = (req, res) => {
    currentUserID = '';
    currentUsername = '';
    res.render('login', {
        title: ''
    });
};



exports.loginUser = async (req,res) => {
    // insert logic to find user via username
    const salt = bcrypt.genSaltSync(10);
    const hashUsername = bcrypt.hashSync(req.body.username, salt);
    const filteredDocs = await fetch(`${userService}${searchUser}${hashUsername}`)
    const compare = bcrypt.compareSync(req.body.password, filteredDocs.password, (err, res) => {});

    if (compare){
        req.session.user = { 
            isAuthenticated: true,
            username: req.body.username
        }
        currentUsername = req.body.username;

        res.redirect(`/settings/${id}`);
    }else {
        res.redirect('/login');
    }
}

exports.logout = (req,res) => {
    req.session.destroy(err => {
        if(err){
            console.log(err);
        }else {
            res.redirect('/login');
        }
    });
}

exports.edit = async  (req, res) => {
    // fetch user data
    const salt = bcrypt.genSaltSync(10);
    const hashUsername = bcrypt.hashSync(currentUsername, salt);
    const filteredDocs = await fetch(`${userService}${searchUser}${hashUsername}`)
    res.render('edit', {
        title: 'Edit User',
        users: filteredDocs,
        username: currentUsername
    });
};

exports.editPerson = async (req,res) => {
    putUrl = `${userService}`;
    
    try {
        
        if (req.body.password != ""){
            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(req.body.password, salt);

            const response = await fetch(putUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    username: req.body.username,
                    password: password
                    })
                });
        }
        else{
        const response = await fetch(putUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            username: req.body.username
            })
        });
        }
        const data = await response.json();
        console.log(data);

        } catch(err) {
        console.log(`Something went wrong, user not created: ${err}`)
        res.redirect('/error')
        } 
    


    res.redirect(`/settings/${req.params.id}`);
};


// Delete method 
exports.delete = async (req, res) => {
    delUrl = `${userService}`;

    try {
        const response = await fetch(delUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            username: req.body.username,
            password: req.body.password
            })
        });
        const data = await response.json();
        console.log(data);

        } catch(err) {
        console.log(`Something went wrong, user not created: ${err}`)
        res.redirect('/error')
        } 

    res.redirect(`/settings/${req.params.id}`);
};

exports.error = (req,res) => {
    res.render('error', {
        title: 'Error Page'
    })
}

exports.video = async (req, res) => {
    // get video details

    res.render('video',{
    title: '',
    description: '',
    file: ''
    })
};



exports.uploadVideo = async (req, res) => {
    res.render('upload',{
    title: ''
    })
};

exports.upload = async (req, res) => {
    postUrl = `${videoService}${addVideo}`;

    try {
        const response = await fetch(postUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            title: req.body.title,
            description: req.body.description,
            file: req.body.myFile
            })
        });
        const data = await response.json();
        console.log(data);

        console.log(req.body.videoTitle + ' added');
        res.redirect('/login'); 

        } catch(err) {
        console.log(`Something went wrong, user not created: ${err}`)
        res.redirect('/error')
        } 
}