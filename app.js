const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const coins = require("./coins");
const config = require("./config");

let app = express();


if (!(config.publicKey && config.chainCode)) {
  console.error("please config publicKey and chainCode in config/index.js");
  return;
}


app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.get('/address', function (req, res) {
  let index = req.query.index;
  let amount = req.query.amount;

  index = index || 0;
  amount = amount || 1;

  index = index & 0xffffffff


  ret = {
    coins: {},
    error: 0
  };
  ret.coins = coins.getAddressByIndexWithAmount(index, amount);
  res.send(JSON.stringify(ret));
});

app.post('/confirm', function (req, res) {
  coins.confirm(req.body.coin, req.body.token);
  res.send();
});

let server = require('http').createServer(app);
server.listen(3000);
