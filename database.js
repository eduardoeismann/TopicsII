
// module database.js

const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();

var mongodb= require('mongodb');
var MongoClient= mongodb.MongoClient;

const uri = "mongodb+srv://eduardo:Feevale2019@topicosii-flrey.mongodb.net/test?retryWrites=true";

var db;
var error;
var waiting = []; // Callbacks waiting for the connection to be made


MongoClient.connect(uri,{ useNewUrlParser: true },function(err,database) {

    app.listen( 8080, () => {
        console.log( 'Server running on port 8080' );
    });

    error = err;
    db = database;

    waiting.forEach(function(callback) {
        callback(err, database);
    });
});

module.exports = function(callback) {
    if (db || error) {
        callback(error, db);
    } else {
        waiting.push(callback);
    }
}
