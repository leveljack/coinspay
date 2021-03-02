let crypto = require('crypto');
let cs = require('coinstring');
const Address = require("./base");
const axios = require("axios");

const logger = require("log4js").getLogger();
logger.level = require("../../config").logLevel;


let queryUrl = "https://blockchain.info/balance?active=";
module.exports= class BTC extends Address {
    constructor(register) {
        super(register);
        this.tryDuration = [15, 10, 10, 10, 10, 20, 25, 30];
        // this.tryDuration = [5];//for test
    }
    getAddressByPublicKey(publicKey) {
        // return "3FWBcbCWdHZAnbhEbFJ3quumYipT7NHzgh";//for test
        let pub = Buffer.from(publicKey, 'hex')
        // let version = coinInfo(_network).versions
        let sha = crypto.createHash('sha256').update(pub).digest()
        let pubKeyHash = crypto.createHash('rmd160').update(sha).digest()
        // let _version = bufferizeVersion(version.public)
        let address = cs.encode(pubKeyHash, 0x0)
        return address;
    }
    crondJob(req, resolve, reject) {
        let balance = req.request_balance;
        axios.get(queryUrl + req.address).then(function (res) {
            logger.info("receive btc data: " + JSON.stringify(res.data));
            if (balance <  res.data[req.address].final_balance) {
                req.receive_balance = res.data[req.address].final_balance / 10**8;
                resolve();
            }
            reject();
        }).catch(function (e) {
            logger.error(e);
            reject();
        });
    }
}