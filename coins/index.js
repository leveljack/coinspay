const merge = require("merge");
const config = require("../config");

let coinsmap = {};

for(let i =0;i < config.support_coins.length;i++) {
    let name = config.support_coins[i];
    try {
        let coin = require("./address/" + name.toLocaleLowerCase());
        new coin(coinsmap);
    }catch {
        
    }
}


module.exports = {
    getAddressByIndexWithAmount(index, amount) {
        let ret = {}
        for (const coin in coinsmap) {
            const element = coinsmap[coin];
            merge(ret, element.getAddressByIndexWithAmount(index, amount));
        }
        return ret;
    },
    confirm(coin, token) {
        if (coinsmap[coin]) {
            coinsmap[coin].confirm(token);
        }
    }
}