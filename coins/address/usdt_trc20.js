'use strict';

const ethJs = require('ethereumjs-util');
const baseX = require('base-x')
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const bs58 = baseX(ALPHABET)
const axios = require('axios');
axios.default.timeout = 10000;
const Address = require("./base");

const logger = require("log4js").getLogger();
logger.level = require("../../config").logLevel;

let queryUrl = "https://apilist.tronscan.org/api/account?address=";


module.exports = class USDT_TRC20 extends Address {
    // constructor(register) {
    //     super(register);
    //     // this.tryDuration = [5];// for test
    // }
    getAddressByPublicKey(publicKey) {
        // return "TKeihRPNTfkno9agWqzVKZHXesE9TFjzYT";// for test
        let pubBuff = Buffer.from(publicKey, 'hex')
        let addrBuff = ethJs.publicToAddress(pubBuff, true)
        let newBuff = Buffer.from([0x41]);
        let AddressBuff = Buffer.concat([newBuff, addrBuff], 21)
        let h1 = ethJs.sha256(AddressBuff)
        let h2 = ethJs.sha256(h1)
    
        let checksum = Buffer.alloc(4);
        h2.copy(checksum, 0, 0, checksum.length);
    
        let trxAddress = Buffer.alloc(AddressBuff.length + checksum.length)
        trxAddress = Buffer.concat([AddressBuff, checksum], trxAddress.length);
        return bs58.encode(trxAddress);
    }
    crondJob(req, resolve, reject) {
        let request_balance = req.request_balance;
        let balance = req.balance;
        axios.get(queryUrl + req.address).then(function (res) {
            logger.info("receive trx data: " + JSON.stringify(res.data.tokens) );
            for(let i = 0;i < res.data.tokens.length;i ++) {
                let item = res.data.tokens[i];
                if (item.tokenAbbr == "USDT") {
                    let receive_balance = item.balance / 10 ** 6;
                    if (receive_balance >= balance + request_balance) {
                        req.receive_balance = receive_balance;
                        resolve();
                        return;
                    } 
                    break;
                }
            }
            reject();
        }).catch(function (e) {
            logger.error(e);
            reject();
        });
    }
}