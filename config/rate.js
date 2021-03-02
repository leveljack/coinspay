let prices = {
    "USDT": 6.6,
    "BTC": 300000,
    "NANO": 30
}
module.exports = {
    getPrice(name) {
        if (prices[name])
            return prices[name];
        return 1;
    }
}