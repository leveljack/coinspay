const wallet = require("./wallet");

let mywallet = wallet.generateWallet();

console.log("");
console.log("     seed: ", mywallet.seed.toString("hex"));
console.log("");
console.log("      pub: ", mywallet.publicKey.toString("hex"))
console.log("");
console.log("chainCode: ", mywallet.chainCode.toString("hex"))
return;


//从seed index获得私钥、公钥
var seed = mywallet.seed.toString("hex");//你的seed
var index = 0;//钱包索引，也是订单索引
let {privateKey, publicKey}= wallet.getPrivateKeyBySeedWithIndex(seed, index);
console.log("");
console.log("      pri: ", privateKey.toString("hex"))
console.log("");
console.log("publicKey: ", publicKey.toString("hex"))

//从公钥生成地址：
var BTC = require("./coins/address/btc");
var btc = new BTC();
var address = btc.getAddressByPublicKey(publicKey);
console.log("");
console.log("   address：",  address);
