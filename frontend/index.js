// npm init -y 
// npm install express cors
// node server.js

const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
var cors = require('cors');
app.use(cors());


app.use(express.static( path.join(__dirname, 'build') ))

app.get('/', function(req,resp){
  resp.sendFile( path.join(__dirname, 'build/index.html') )
}) 
//이 코드는 항상 가장 하단에 놓아야 잘됩니다. 
app.get('*', function (req, resp) {
  resp.sendFile(path.join(__dirname, 'build/index.html'));
});


app.listen(3020, function () {
  console.log('shopAAH listening on 3020')
}); 