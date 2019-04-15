const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();

const MongoClient = require( 'mongodb' ).MongoClient.connect;
const ObjectId = require( 'mongodb' ).ObjectId;

var db;

const uri = "mongodb+srv://eduardo:Feevale2019@topicosii-flrey.mongodb.net/test?retryWrites=true";

MongoClient.connect(uri,{ useNewUrlParser: true },function(err,client) {

    app.listen( 8080, () => {
        console.log( 'Server running on port 8080' );
    });

    if(err){
        console.log(err);
    } else {
        console.log('connected to '+ uri);
	db = client.db('topicosii');
    }
});

app.use( bodyParser.urlencoded( { extended: true } ) );
app.set( 'view engine', 'ejs' );

app.get( '/', ( req, res ) => {
    res.render( 'index.ejs' );
});

app.get( '/', ( req, res ) => {
    var cursor = db.collection( 'data' ).find();
});

app.get( '/show', ( req, res ) => {
    db.collection( 'data' ).find().toArray( ( err, results ) => {
        if ( err ) return console.log( err );

        res.render( 'show.ejs', { data: results } );
    });
});

app.post( '/show', ( req, res ) => {
    db.collection( 'data' ).save( req.body, ( err, result ) => {
        if ( err ) return console.log( err );

        console.log( 'Dados salvos!' );
        res.redirect( '/show' );
    });
});

app.route( '/edit/:id' ).get( ( req, res ) => {
    var id = req.params.id;

    db.collection( 'data' ).find( ObjectId( id ) ).toArray( ( err, result ) => {
        if ( err ) return res.send( err );

        res.render( 'edit.ejs', { data: result } );
    });
})
.post( ( req, res ) => {
    var id = req.params.id;
    var name = req.body.name;
    var surname = req.body.surname;
    var file = req.body.file;

    db.collection( 'data' ).updateOne( {_id: ObjectId( id ) }, {
        $set: {
            name: name,
            surname: surname,
            file: file
        }
    }, ( err, result ) => {
        if ( err ) return res.send( err );

        res.redirect( '/show' );
        console.log( 'Dado atualizado!' );
    });
});

app.route( '/delete/:id' ).get( ( req, res ) => {
    var id = req.params.id;

    db.collection( 'data' ).deleteOne( { _id: ObjectId( id ) }, ( err, result ) => {
        if ( err ) return res.send( 500, err );

        console.log( 'Dado deletado!' );
        res.redirect( '/show' );
    });
});
