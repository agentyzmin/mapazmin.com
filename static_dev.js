'use strict';

// Simple replacement to nginx server

var express = require('express'),
    path = require('path'),
    request = require('request'),
    app = express();

process.title = 'a3_yarval_static';
app.use('/', express.static(path.join(__dirname + '/')));

app.use('/research', index);

app.listen(7781);

function index(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
}