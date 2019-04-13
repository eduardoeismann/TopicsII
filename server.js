const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<user>:<password>@topicosii-flrey.mongodb.net/test?retryWrites=true";

app.use( bodyParser.urlencoded({ extended: true }) );
app.set( 'view engine', 'ejs' );

MongoClient.connect( uri, ( err, client ) => {
    if ( err ) return console.log( err );

    db = client.db('topicosii');

    app.listen( 3000, () => {
        console.log('Server running on port 3000');
    });
});

app.get( '/', ( req, res ) => {
    console.log( 'Running GET here!' );
    res.render( 'index.ejs' );
});

app.post( '/show', ( req, res ) => {
    db.collection('data').save( req.body, ( err, result ) => {
        if ( err ) return console.log( err );

        console.log('salvo no banco de dados');

        res.redirect('/');
    });
});
