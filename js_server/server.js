var express = require('express');
var cors = require('cors')
var app = express();
app.use(cors())
var fs = require("fs");




app.get('/transactions', function (req, res) {
   fs.readFile( __dirname + "/" + "transactions.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})