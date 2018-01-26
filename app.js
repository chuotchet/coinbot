var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');
var request = require('request');
var coinlist = [];
fs.readFile('coinlist.txt', function (err, data) {
  if (err) throw err;
  coinlist = JSON.parse(data);
});

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: 'bd2d6a40-4d78-4afb-93c2-32b781a1035e',
    appPassword: 'wifTS56|}eztkKIAGK740%;'
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

server.get('/', function (req, res, next) {
  res.send('ahihi');
  return next();
});

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    var message = session.message.text;
  console.log(message);
    var coinName = coinlist[message.toUpperCase()];
    if (!coinName) coinName = message.toLowerCase();
    request('https://api.coinmarketcap.com/v1/ticker/'+coinName, function (error, res, body) {
      var response = '';
      if (res.statusCode === 200) {
        var data = JSON.parse(body)[0];
        response = data.name + '\n\n';
        response += 'USD: ' + data.price_usd + '$\n\n';
        response += 'BTC: ' + data.price_btc + '\n\n';
        response += '1h change: ' + data.percent_change_1h + '%\n\n';
        response += '24h change: ' + data.percent_change_24h +'%\n\n';
        response += 'Rank: ' + data.rank + '\n';

      }
      else {
        response = 'Cannot find the coin, please check if it correct!'
      }
      session.send(response);
    });


});
