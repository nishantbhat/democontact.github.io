/**
 * Created by nishu on 28/7/17.
 */


var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    morgan = require('morgan'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path');
var user = require('./routes/sendmessage');
app = module.exports = express();
https = require("https");
var cron = require('cron');
const fs = require('fs');
var cors = require('cors');
app.use(cors());

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * Configuration
 */



// all environments
app.set('port', process.env.PORT || 8000);
app.use(morgan('dev'));
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
    app.use(errorHandler());
}

// production only
if (env === 'production') {
    // TODO
}


/**
 * Routes
 */

app.get('/', function (request, response) {
    response.sendFile('index.html'); //Since we have configured to use public folder for serving static files. We don't need to append public to the html file path.
});

app.post('/user/SendMessage', user.SendMessage);

app.get('/user/ReadMessage', user.ReadMessage);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
// https.createServer(options,app).listen(8000, function () {
//  console.log('https server listening on port 8000');
// });


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    //console.log(err);
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leacked to users
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});