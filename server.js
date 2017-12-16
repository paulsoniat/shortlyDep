var app = require('./server-config.js');
var env = require('require-env');
require('dotenv').config();


var port = 80;

if (process.env.NODE_ENV !== 'deployment') {
  port = 4568;
}


app.listen(port);

console.log('Server now listening on port ' + port);
