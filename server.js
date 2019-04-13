const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use( bodyParser.urlencoded({ extended: true }) );
app.set( 'view engine', 'ejs' );

app.listen( 3000, function() {
    console.log('Server running on port 3000');
});

app.get( '/', ( req, res ) => {
    console.log( 'Running GET here!' );
    res.render( 'index.ejs' );
});

app.post( '/show', ( req, res ) => {
    console.log( 'Running POST here!' );
    console.log( req.body );
});
