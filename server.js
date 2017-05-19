var express = require('express');
var app     = express();
var path    = require('path');

app.use(express.static(path.join(__dirname,'/')));

//Routing
app.get('/', function(req, res){
  res.render('index')
});

app.listen(process.env.PORT || 5000, function(){
  console.log("=============================");
  console.log("SERVER LISTENING ON PORT 5000");
  console.log("=============================");
});