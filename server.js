var app = require('./server-config.js');
var port;
if (process.env.NODE_STATE === 'development') {
  port = 4568;
} else {
  port = 80;
}

// port = 4568;

app.listen(port);

console.log('Server now listening on port ' + port);