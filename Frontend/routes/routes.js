const { request } = require("express");

const { fileURLToPath } = require("url");
const expressSession = require('express-session');
const { Console } = require("console");

const url = '';


// Creates the create user page
exports.create = (req, res) => {
    res.render('create', {
        title: ''
    });
};

// Stores the data from the create user page
exports.createUser = async (req, res) => {
    postUrl = `${url}`;

    try {
        const response = await fetch(postUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            username: req.body.username,
            email: req.body.email,
            age: req.body.age,
            password: req.body.password
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
exports.index = async (req, res) => {

    res.render('index', {
        title: 'Welcome',
        users: filteredDocs
    });
};


//Loads the login page
exports.login = (req, res) => {
    res.render('login', {
        title: ''
    });
};


//Gets data from login page and checks if it's in the database
    //Then, it logs the user in if it is
exports.loginUser = async (req,res) => {
    // insert logic to find user via username
    // compare their password to inputted password
    if (res.body.password == userPassword){
        req.session.user = { 
            isAuthenticated: true,
            username: req.body.username
        }
        
        res.redirect(`/index/${filteredDocs._id}`);
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
    await client.connect();
    const filterDocs = await collection.find(ObjectId(req.params.id)).toArray()
    client.close();
    res.render('edit', {
        title: 'Edit User',
        users: filterDocs[0]
    });
};

exports.editPerson = async (req,res) => {
    putUrl = `${url}`;

    try {
        const response = await fetch(putUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            username: req.body.username,
            email: req.body.email,
            age: req.body.age,
            password: req.body.password
            })
        });
        const data = await response.json();
        console.log(data);

        } catch(err) {
        console.log(`Something went wrong, user not created: ${err}`)
        res.redirect('/error')
        } 

    res.redirect(`/index/${req.params.id}`);
};


// Delete method 
exports.delete = async (req, res) => {

};