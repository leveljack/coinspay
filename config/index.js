module.exports = {
    publicKey: "",
    chainCode: "",

    callbackUrl: "",

    support_coins: ["USDT_TRC20", "BTC"],
    entity: {
        USDT_TRC20: {
            name: "USDT_TRC20",
            unit: "USDT",
            label: "USDT - （手续费低、到账快）",
            network: "TRC20"
        },
        BTC: {
            name: "BTC",
            unit: "BTC",
            label: "BTC"
        }
    },

    logLevel: "debug",

}