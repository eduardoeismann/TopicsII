const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();

const MongoClient = require( 'mongodb' ).MongoClient.connect;
const ObjectId = require( 'mongodb' ).ObjectId;

const uri = "mongodb+srv://eduardo:Feevale2019@topicosii-flrey.mongodb.net/test?retryWrites=true";

'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});

MongoClient.connect(uri,{ useNewUrlParser: true },function(err,db){

    app.listen( 8080, () => {
        console.log( 'Server running on port 3000' );
    });

  if(err){
      console.log(err);
  }
  else {
      console.log('connected to '+ uri);
      db.close();
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
            surname: surname
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
