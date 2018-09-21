/**
* Node.js Server configuration script
*/

// Require the packages we will use:
var http = require("http"),
    fs = require("fs"),
    express = require('express');

var appEx = express();
var app = http.createServer(appEx);

app.listen(8080);  //listen on port 8080

// allow use of files in public folder
appEx.use(express.static(__dirname + '/public'));

// Set default served page upon first download
appEx.get('/', function(req, res){
    res.sendFile('LoginPage.html', { root: __dirname + "/public/html" } );
});
