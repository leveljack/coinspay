
const wallet = require("../../wallet");
const Keyv = require('keyv');
const keyv = new Keyv();
const config = require("../../config");
const merge = require("merge");

const rate = require("../../config/rate");
const { default: axios } = require("axios");

const logger = require("log4js").getLogger("system");
logger.level = config.logLevel;

let price = 30;

function getFixed(num) {
    num = parseInt(num) || 1;
    if (num / 100000 > 1) {
        return 6;
    }
    if (num / 10000 > 1) {
        return 5;
    }
    if (num / 1000 > 1) {
        return 4;
    }
    if (num / 100 > 1) {
        return 3;
    }
    return 2;
}

module.exports = class Address {
    constructor(register) {
        // console.log(this.constructor.name);
        let name = this.constructor.name;
        this.entity = config.entity[name];
        if (!this.entity) return;
        this.tryTimes = 10;
        this.tryDuration = [5];
        register = register || {};
        config.support_coins.includes(this.entity.name) && (register[this.entity.name] = this)
    }
    getAddressByIndexWithAmount(index, total, balance) {
        balance = balance || 0;
        let ret = {};
        let item = merge({}, this.entity);
        item.address = this.getAddressByPublicKey(this.getPublicKeyByIndex(index));
        item.amount = total;
        let price = rate.getPrice(this.entity.unit);
        item.rate = price;
        item.request_balance = parseFloat((total / price).toFixed(getFixed(price)));
        item.balance = balance;
        item.index = index;
        item.token = require("crypto").createHash("sha256").update(this.entity.name + index + total).digest("hex");


        keyv.set(item.token, item, 45 * 60 * 1000);
        ret[this.entity.name] = this.getOriginData(item);
        return ret;

    }
    getPublicKeyByIndex(index) {
        return wallet.getPublicKeyByIndex(index)
    }
    confirm(token) {
        let that = this;
        keyv.get(token).then(function (data) {
            if (!data) return;
            let id = require("crypto").randomBytes(32).toString("hex");
            keyv.set(token + "_id", id).then(function () {
                that.crond(data, 0, id);
            })
        })
    }
    async crond(data, time, id) {
        let current_id = await keyv.get(data.token + "_id");
        if (current_id != id) {
            // console.log("cancel confirm " + JSON.stringify(data) + " at " + time + " times");
            logger.debug("cancel confirm " + JSON.stringify(this.getOriginData(data)) + " at " + time + " times");
            return;
        }
        let that = this;
        if (time >= this.tryTimes) {
            logger.debug("failed confirm " + JSON.stringify(this.getOriginData(data)) + " after " + this.tryTimes + " times");
            return;
        }
        logger.debug("start confirm for " + JSON.stringify(this.getOriginData(data)) + " at " + time + " times");
        setTimeout(function () {
            new Promise(function (resolve, reject) {
                that.crondJob(data, resolve, reject);
            }).then(function () {
                that.callback(data);
            }).catch(function (e) {
                if (e) {
                    logger.error(e)
                }
                that.crond(data, ++time, id);
            })
        }, (this.tryDuration[time] ? this.tryDuration[time] : 5) * 60 * 1000);
    }
    callback(data) {
        logger.info("send callback " + JSON.stringify(data));
        if (config.callbackUrl) {
            axios.post(config.callbackUrl, data).then(function (res) {

            }).catch(function (err) {
                logger.error("fail callback " + err);
            });
        }
    }
    crondJob(data, resolve, reject) {
        reject();
    }
    getOriginData(data) {
        return {
            name: data.name,
            address: data.address,
            label: data.label,
            amount: data.amount,
            request_balance: data.request_balance,
            network: data.network,
            token: data.token
        }
    }
}