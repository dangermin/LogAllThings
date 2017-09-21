const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const app = express();
const moment = require('moment');
const path = require('path');

// Add Middleware
app.use(morgan('dev'));

// Check file access
fs.access('/log.csv',fs.constants.R_OK | fs.constants.W_OK, (err) => {
  console.log(err ? 'no access!' : 'can read/write');
});

app.use((req, res, next) => {
// write your logging code here
  global.agent = req.headers['user-agent'].replace(",", " |");
  global.time = moment().format();
  global.method = req.method;
  global.resource = req.path;
  global.version = req['httpVersion'];
  version = ("HTTP/" + version);
  global.status = res.statusCode;
  global.logInstance = {
    Agent: agent,
    Time: time,
    Method: method,
    Resource: resource,
    Version: version,
    Status: status
  }
  console.log(logInstance);

  const log = fs.appendFile('server/log.csv', JSON.stringify(logInstance) + '\n', function(err, fd) {
    next()
  })
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
  res.status(200).send('OK');
});

app.get('/logs', (req, res) => {
  // write your code to return a json object containing the log data here
  let logs = fs.readFileSync('server/log.csv').toString()
  console.log(logs)
  let logArray = logs.split('\n')
  // console.log(logArray)
  logArray.pop()
  // console.log(logArray)
  logs = logArray.join(',')
  // console.log(logs)
  res.send('[' + logs + ']')

});

module.exports = app;
