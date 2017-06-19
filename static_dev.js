'use strict';

// Simple replacement to nginx server
const PORT = 7781;

var express = require('express'),
    path = require('path'),
    request = require('request'),
    app = express();

process.title = 'a3_yarval_static';
app.use('/', express.static(path.join(__dirname + '/')));

app.use('/research', index);

app.listen(PORT);
console.log('Web server started on port: ' + PORT);

function index(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
}