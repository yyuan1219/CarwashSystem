<template>
  <el-card class="box-card">
    <div :style="zhifubaostyle" class="zhifubao">
      <img src="../../assets/zhifubao.jpg" />
    </div>
    <div :style="weixinstyle" class="weixin">
      <img src="../../assets/weixin.jpg" alt="" />
    </div>
    <ul class="msg-box">
      <li>
        <h4>我要充值</h4>
      </li>
      <li>
        <h4 style="margin-bottom: 15px">充值金额</h4>
        <el-radio-group v-model="amountVal" @change="amountChange">
          <el-radio border :label="'' + 100">充值100</el-radio>
          <el-radio border :label="'' + 500">充值500</el-radio>
          <el-radio border :label="'' + 1000">充值1000</el-radio>
          <el-radio border :label="'' + 2000">充值2000</el-radio>
          <el-radio border :label="'' + 5000">充值5000</el-radio>
          <el-radio border :label="''">自定义</el-radio>
        </el-radio-group>
      </li>
      <li>
        <h4 style="margin-bottom: 15px">充值方式</h4>
        <el-radio-group
          v-model="rechargeParams.paymentType"
          @change="paymentTypeChange"
        >
          <el-radio border :label="'' + 0">微信</el-radio>
          <el-radio border :label="'' + 1">支付宝</el-radio>
        </el-radio-group>
      </li>
      <li>
        <h4 style="margin-bottom: 15px">充值金额</h4>
        <el-input
          :disabled="disabled"
          clearable
          v-model="rechargeParams.totalAmt"
          placeholder="请输入金额"
          style="width: 150px"
        ></el-input>
      </li>
    </ul>
    <div style="text-align: center; margin-top: 30px">
      <el-button type="primary" @click="surePay">确认支付</el-button>
    </div>
  </el-card>
</template>
  
 <script>
export default {
  data() {
    return {
      zhifubaostyle: {
        ZIndex: 999,
        position: "absolute",
        right: "600px",
        width: "500px",
        height: "600px",
        display: "none",
      },
      weixinstyle: {
        right: "600px",
        position: "absolute",
          width: "500px",
        height: "600px",
        display: "none",
      },
      money: 0,
      user: {
        email: "",
        id: "",
        mobile: "",
        rid: 1,
        username: "",
      },
      amountVal: "",
      disabled: false,
      //充值参数
      rechargeParams: {
        totalAmt: "", //金额
        paymentType: "0", //支付方式[0:微信,1:支付宝,2:余额,3:活动]
        transType: "0", //交易类型[0:充值,1:消费]
      },
    };
  },
  created() {
    var user = sessionStorage.getItem("user");
    this.user = JSON.parse(user);
    this.money = sessionStorage.getItem("money");
  },
  methods: {
    //充值金额
    amountChange(val) {
      this.rechargeParams.totalAmt = val;
      if (val == "") {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    //支付方式
    paymentTypeChange(val) {
      this.rechargeParams.paymentType = val;
      console.log(this.rechargeParams.paymentType);
    },
    //确认支付
    async surePay() {
      if (this.rechargeParams.totalAmt == "") {
        this.$message.warning("请输入金额");
        return;
      }
      if (this.rechargeParams.paymentType === '0') {
        this.weixinstyle.display='block'
      }else{
        this.zhifubaostyle.display='block'
      }

      var money = +this.money + +this.rechargeParams.totalAmt;

      // this.rechargeParams.totalAmt=(this.money-0) + (this.rechargeParams.totalAmt-0)
      fetch(
        `http://localhost:3000/money/moneyrevise?id=${this.user.id}&money=${money}`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.ok === 200) {
            setTimeout(()=>{
              location.reload();

            },1000)
            this.$message.success(`充值成功`);

          }
          // window.sessionStorage.setItem("money", res.data[0].mg_money); //存储user对象
        });
    },
  },
};
</script>
  
 <style scoped>
/* 信息列表样式 */
.msg-box > li {
  list-style: none;
  border-bottom: 1px solid #c5c5c5;
  padding: 20px 10px;
}
.zhifubao,.weixin{
  z-index: 999;
}

img {
  width: 100%;
  height: 100%;
}
</style>