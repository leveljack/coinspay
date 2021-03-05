module.exports.getIndex = async function (order_id, amount) {
    return {
        index: order_id,
        balance: {
            USDT_TRC20: 0
        }
    }
}