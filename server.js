const express = require('express');
const app = express();

app.set( 'view engine', 'ejs' );

app.listen( 3000, function() {
    console.log('Server running on port 3000');
});

app.get( '/', ( req, res ) => {
    // res.send( 'Que a força esteja com você!' );
    res.render( 'index.ejs' );
});
