var request = require('request');
var fs = require('fs');
request('https://api.coinmarketcap.com/v1/ticker/?limit=2000', function (error, response, body) {
  // console.log('body:', body); // Print the HTML for the Google homepage.
  console.log(JSON.parse(body).length);
  data = JSON.parse(body);
  var coinArr = {};
  for (var i = 0; i < data.length; i++) {
    coinArr[data[i].symbol] = data[i].id;
  }
  fs.writeFile("coinlist.txt", JSON.stringify(coinArr), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
});
