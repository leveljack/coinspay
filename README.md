# coinspay

适用于数字货币（BTC、USDT和其他任意数字货币）的付款方案，[体验地址](http://158.247.207.59/demo.html)

## 安装步骤
```
git clone https://github.com/freepayment/coinspay.git //拷贝项目
cd coinspay //进入项目目录
npm install //安装项目依赖

npm run build //构建项目
```
## 运行项目
运行前需先生成自己的数字钱包，把生成的publicKey和chainNode保存到config/index.js相应配置项下，seed（非常重要，不能丢失）则保存到自己的电脑
```
node generate.js
```
运行项目
```
node app //后台长期运行，可以执行 nohup node app 2>&1 & 
```
浏览器访问：[http://127.0.0.1:3000](http://127.0.0.1:3000)

## 快速集成项目
以 http://127.0.0.1:3000?index=订单索引&amount=订单金额 的方式，可以生成不同的数字货币收款地址和金额，其中订单索引必须为整数。

当收款地址确定收到款后，config/index.js里配置的callbackUrl将会收到回调，回调详细参数如下：
| 参数 | 解释 |
| ------ | ------ |
| index | 订单索引  |
| amount | 订单金额  |
| name | 数字货币名称  |
| address | 数字货币地址  |
| rate | 数字货币单价 |
| request_balance | 根据amount计算得到的数字货币数量，rate * request_balance = amount |
| receive_balance | 该地址的数字货币数量，可以大于balance |
