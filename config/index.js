module.exports = {
    publicKey: "",
    chainCode: "",

    callbackUrl: "",

    support_coins: ["USDT_TRX", "BTC"],
    entity: {
        USDT_TRX: {
            name: "USDT_TRX",
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