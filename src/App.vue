<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <el-form >
      <el-form-item>
        <el-select v-model="name" placeholder="选择虚拟货币" style="width:100%;" @change="change">
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.label"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="name">
        <div class="detail" style="text-align: center;" v-if="options[name].request_balance">支付数量：<span class="balance">{{ options[name].request_balance }}</span>  {{options[name].unit}}</div>
        <div id="qrcode" class="detail"></div>
        <div class="detail label">收款地址：{{options[name].address}}</div>
        <div class="detail label" v-if="options[name].network">主网络：<span class="network">{{options[name].network}}</span></div>
        <div class="detail" style="margin-top:20px;">
          <el-button round style="display:block;margin:0 auto;" @click="doCopy">{{clipText}}</el-button>
        </div>
      </el-form-item>
    </el-form>         
  </div>
</template>

<script>

import QRCode from 'qrcodejs2';
import axios from 'axios';
let timer = null;
let qrcode = null;
let tokens = {};
function getQueryString(name) { 
  let reg = `(^|&)${name}=([^&]*)(&|$)`
  let r = window.location.search.substr(1).match(reg); 
  if (r != null) return unescape(r[2]); return null; 
}
export default {
  name: 'app',
  data() {
    return {
      options: {
      },
      name: '',
      clipText: "点击复制收款地址"
    }
  },
  methods: {
      change () {
        this.qrcode();
        if (!tokens[this.name]) {
          let req = {
            coin: this.name,
            token: this.options[this.name].token
          };          
          tokens[this.name] = true;
          axios.post('/confirm', req)
        }
      },
      qrcode () {
          if (qrcode != null) {
             qrcode.clear();
             qrcode.makeCode(this.options[this.name].address);
          } else {
            this.$nextTick (function () {
              qrcode = new QRCode('qrcode', {
                  width: 180,
                  height: 180, // 高度
                  text: this.options[this.name].address // 二维码内容
                  // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                  // background: '#f0f'
                  // foreground: '#ff0'
              })
            })
          }
      },
      doCopy() {
        clearTimeout(timer);
        var that = this;
        this.$copyText(this.options[this.name].address).then(function () {
          that.clipText = "复制成功";
          timer = setTimeout(function () {
            that.clipText = "点击复制收款地址";
          }, 500);
        }, function () {
          that.clipText = "复制失败";
          timer = setTimeout(function () {
            that.clipText = "点击复制收款地址";
          }, 500);

        })
      }
  },
  mounted () {
      let that = this;
      // this.qrcode()
      let params = "?env=production";
      params +=  getQueryString("order_id") ? "&order_id=" + getQueryString("order_id") : "";
      params +=  getQueryString("amount") ? "&amount=" + getQueryString("amount") : "";
      axios.get("/address" + params).then(function (response) {
        console.log(response.data);
        that.options = response.data.coins;
      });
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 20px auto;
  max-width: 500px;
}
.detail {
  width: 100%;
}
#qrcode img, #qrcode canvas{
  margin: 0 auto;
  display: block;
}
.label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 32px;
  text-align: center;
}
.balance {
  color: blue;
  font-size: 1.3em;
}
.network {
  color: green;
}
</style>
