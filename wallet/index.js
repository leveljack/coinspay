let bip32 = require('bip32');
let config = require("../config");
let masternode;
if (config.publicKey && config.chainCode) {
    masternode = bip32.fromPublicKey(Buffer.from(config.publicKey, "hex"), Buffer.from(config.chainCode, "hex"));
}
let indexMap = {};

module.exports = {
    getPublicKeyByIndex(index) {
        if (indexMap[index]) 
            return indexMap[index];
        let {publicKey} = masternode.derive(index);
        indexMap[index] = publicKey;
        return publicKey;
    },
    generateWallet() {
        let seed = require("crypto").randomBytes(32);
        let {publicKey, chainCode} = bip32.fromSeed(seed);
        return {seed, publicKey, chainCode};
    },
    getPrivateKeyBySeedWithIndex(seed, index) {
        let node = bip32.fromSeed(Buffer.from(seed, "hex"));
        return node.derive(index);
    }
}