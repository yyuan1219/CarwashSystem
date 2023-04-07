<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>购物车</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 表格数据 -->
      <el-table :data="cargoodlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          width="300px"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="总价" width="150px">
          <template slot-scope="scope">
            {{(scope.row.totalPrice=scope.row.goods_price * scope.row.hot_mumber)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            
            <el-button size="mini" @click="decrease(scope.row.goods_id)"
              >-</el-button
            >
            {{ scope.row.hot_mumber }}
            <el-button size="mini" @click="increases(scope.row.goods_id)"
              >+</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              @click="zhifu(scope.row.totalPrice,scope.row.goods_name,scope.row.hot_mumber)"
            >购买</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>点击去往<a href="http://localhost:8080/#/Dingdan">订单中心</a></div>
     
    </el-card>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      money:0,
      user: {
        email: "",
        id: "",
        mobile: "",
        rid: 1,
        username: "",
      },
      // 商品列表
      cargoodlist: [
      ],
     
    };
  },
  created() {
    this.getgoodlist();
    var user = sessionStorage.getItem("user");
    this.user = JSON.parse(user);
    this.money = sessionStorage.getItem("money");

  },
  computed: {
    // totalPrice() {
    //   let sum = 0;
    //   sum+=this.cargoodlist.goods_price*item.hot_mumber
      // this.cargoodlist.forEach((item) => {
      //   sum += item.goods_price * item.hot_mumber;
      // });
    //   return sum;
    // },
  },
  methods: {
      //确认支付
    zhifu(totalPrice,name,number) {
      
      if (totalPrice > this.money) {
        this.$message.warning("您的余额不足");
        return ;
      }
      
      var money = this.money - totalPrice;
      fetch(
        
        `http://localhost:3000/report/addorder?name=${name}&number=${number}&totalPrice=${totalPrice}&username=${this.user.username}`
      )
        .then((res) => res.json())
        .then((res) => {

          if (res.ok === 200) {
            this.$message.success(`购买成功`);
          }

        });
      fetch(
        `http://localhost:3000/money/moneyrevise?id=${this.user.id}&money=${money}`
      )
        .then((res) => res.json())
        .then((res) => {
          this.$message.success(`购买成功`);

          if (res.ok === 200) {

            location.reload();
          }

          // window.sessionStorage.setItem("money", res.data[0].mg_money); //存储user对象
        });
    },
    increases(i) {
      this.cargoodlist.forEach((item, index) => {
        if (i === item.goods_id) {
          this.cargoodlist[index].hot_mumber++;
        }
      });
    },
    decrease(i) {
      this.cargoodlist.forEach((item, index) => {
        if (i === item.goods_id) {
          this.cargoodlist[index].hot_mumber--;
        }
        if (this.cargoodlist[index].hot_mumber < 0) {
          this.cargoodlist[index].hot_mumber = 0;
        }
      });
    },
    // 通过Id删除商品
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }

      this.cargoodlist.forEach((item, index) => {
        if (id === item.goods_id) {
          this.cargoodlist.splice(index, 1);
        }
      });
      this.$message.success("删除商品成功！");
      window.sessionStorage.setItem(
        "cargoodlist",
        JSON.stringify(this.cargoodlist)
      );
    },

    getgoodlist() {
      this.cargoodlist = window.sessionStorage.getItem("cargoodlist");
      this.cargoodlist = JSON.parse(this.cargoodlist);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getgoodlist();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getgoodlist();
    },
  },
};
</script>

<style>
.jiage {
  float: right;
  margin-right: 800px;
}
.zhifu {
  float: right;
  margin-right: 800px;
}
</style>