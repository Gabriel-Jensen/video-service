const express = require('express'),
    pug = require('pug'),
    path = require('path'),
    routes = require('./routes/routes.js');
    expressSession = require('express-session');


const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '\\views');
app.use(express.static(path.join(__dirname, '/views')));



app.use(expressSession({
    secret: "hello world",
    saveUninitialized: true,
    resave: true
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const urlencodedParser = express.urlencoded({
    extended: false
});

const checkAuth = (req, res, next) => {
    if(req.session.user && req.session.user.isAuthenticated){
        next();
    }else {
        res.redirect('/login');
    } 
};

// URLS
app.get('/create', routes.create);
app.post('/create', urlencodedParser, routes.createUser);
app.get('/settings/:username',checkAuth, routes.settings);
app.get('/',routes.login)
app.get('/login',routes.login);
app.post('/login', urlencodedParser, routes.loginUser)
app.get('/logout', routes.logout); 
app.get('/edit/:id', routes.edit);
app.post('/edit/:id', urlencodedParser, routes.editPerson);
app.get('/delete/:id', routes.delete);
app.get('/video/:id', routes.video);
app.get('/error/', routes.error);
app.get('/upload/', routes.uploadVideo);
app.post('/upload/', urlencodedParser, routes.upload)
app.get('/browse/', routes.browse);
app.listen(3000);