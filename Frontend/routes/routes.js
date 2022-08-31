const { request } = require("express");
const { fileURLToPath } = require("url");
const expressSession = require('express-session');
const { Console } = require("console");
const bcrypt = require('bcryptjs');
const { title } = require("process");
const http = require('axios');



const gateway = 'localhost:';

const videoService = `http://${gateway}54304/videos/`;
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
const userService = `http://${gateway}54303/users/`;

let currentUsername = '';
let currentUserID = '';

// Creates the create user page
exports.create = (req, res) => {
    res.render('create', {
        title: ''
    });
};

// Stores the data from the create user page
exports.createUser = async (req, res) => {
    postUrl = `${userService}${addUser}`;
    const salt = bcrypt.genSaltSync(10);
    const hashUsername = req.body.username
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    const payload = {username: hashUsername,
        password: hashPassword,
        age: req.body.age
    };
    
    try {
        const response = await http.post(postUrl, payload);

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
    const filteredDocs = await http.get(`${userService}${searchUser}${currentUsername}`)

    res.render('settings', {
        title: `Welcome ${filteredDocs.data[0].username}!`,
        users: filteredDocs.data[0]
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
    
    const hashUsername = req.body.username
    const filteredDocs = await http.get(`${userService}${searchUser}${hashUsername}`)
    console.log(filteredDocs.data[0].password)

    const compare = bcrypt.compareSync(req.body.password, filteredDocs.data[0].password, (err, res) => {});
    if (compare){
        req.session.user = { 
            isAuthenticated: true,
            username: req.body.username
        }
        currentUsername = req.body.username;
        currentUserID = filteredDocs.data[0].id
        res.redirect(`/settings/user`);
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
    const filteredDocs = await http.get(`${userService}${searchUser}${currentUsername}`)
    res.render('edit', {
        title: 'Edit User',
        users: filteredDocs.data[0],
    });
};

exports.editPerson = async (req,res) => {
    let putUrl = `${userService}update/`
    let payload = {}
    try {
        if (req.body.password != ""){
            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(req.body.password, salt);

            payload = {username: req.body.username,
                password: hashPassword,
                age: req.body.age
            };
        }
        else{
            payload = {username: hashUsername,
                age: req.body.age
            };
        }

        const response = await http.put(postUrl, payload);


        } catch(err) {
        console.log(`Something went wrong, user not created: ${err}`)
        res.redirect('/error')
        } 
    


    res.redirect(`/settings/${currentUsername}`);
};


// Delete method 
exports.delete = async (req, res) => {
    delUrl = `${userService}/${currentUserID}`;

    try {
        const response = await http.delete(delUrl)

        } catch(err) {
        console.log(`Something went wrong, user not created: ${err}`)
        res.redirect('/error')
        } 

    res.redirect(`/logout`);
};

exports.error = (req,res) => {
    res.render('error', {
        title: 'Error Page'
    })
}

exports.video = async (req, res) => {
    // get video details
    try{
    const filteredDocs = await http.get(`${videoService}${req.params.id}`)
    console.log(filteredDocs.data)
    
    res.render('video',{
        title: filteredDocs.data.title,
        description: filteredDocs.data.description,
        file: filteredDocs.data.file
    })
    }catch(err) {
        console.log(`Something went wrong: ${err}`)
        res.redirect('/error')
        } 

};



exports.uploadVideo = async (req, res) => {
    res.render('upload',{
    title: ''
    })
};

exports.upload = async (req, res) => {
    postUrl = `${videoService}${addVideo}`;
    const payload = {
        title: req.body.title,
        description: req.body.description,
        file: req.body.file
    };
        
    try {
        const response = await http.post(postUrl, payload);
    } catch(err) {
        console.log(`Something went wrong, user not created: ${err}`)
        res.redirect('/error')
    } 

        console.log(req.body.title + ' added');
        res.redirect(`/settings/${currentUsername}`);
        
}

exports.browse = async (req,res) => {
    const filteredDocs = await http.get(`${videoService}${getAllVideos}`)
    console.log(filteredDocs.data);

    res.render('browse', {
        title: `Browse Videos`,
        database: filteredDocs.data
    });
}