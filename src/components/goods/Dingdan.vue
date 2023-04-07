<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>订单中心</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-table :data="glorderlist" border stripe v-show="this.user.rid !== 31">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="good_name"
          width="300px"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="money"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="商品价格"
          prop="number"
          width="70px"
        ></el-table-column>
        <el-table-column
          label="回复信息"
          prop="huifu"
          width="170px"
        ></el-table-column>
        <el-table-column
          label="留言信息"
          prop="ordermessage"
          width="170px"
        ></el-table-column>

        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
           
            <el-button
              type="primary"
              size="mini"
              @click="openhuifu(scope.row.id)"
              >回复</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="orderlist" border stripe v-show="this.user.rid === 31">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="good_name"
          width="300px"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="money"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="number"
          width="70px"
        ></el-table-column>

        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="openliuyan(scope.row.id)"
              >评价</el-button
            >
            
          </template>
        </el-table-column>
      </el-table>

      <h3 >留言版</h3>
    <el-table v-show="this.user.rid === 31" :data="glorderlist" border stripe>
      <el-table-column type="index"></el-table-column>

      

      <el-table-column label="商品名称" prop="good_name"></el-table-column>
      <el-table-column label="商品金额" prop="money"></el-table-column>

      <el-table-column label="评价内容" prop="ordermessage"></el-table-column>
      <el-table-column
        label="回复内容"
        prop="huifu"
      ></el-table-column>

     
     
    </el-table>

      <el-dialog
        title="回复信息"
        :visible.sync="huifuDialogVisible"
        width="50%"
        @close="huifuDialogClosed"
      >
        <!-- 内容主体 -->
        <el-form :model="addmessageForm" label-width="100px">
          <el-form-item label="回复内容" prop="ordermessage">
            <el-input v-model="addmessageForm.ordermessage"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="huifuDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="huifu()">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="评价信息"
        :visible.sync="pingjiaDialogVisible"
        width="50%"
        @close="pingjiaDialogClosed"
      >
        <!-- 内容主体 -->
        <el-form :model="addmessageForm" label-width="100px">
          <el-form-item label="评价内容" prop="ordermessage">
            <el-input v-model="addmessageForm.ordermessage"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="pingjiaDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="liuyan()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: -1,
      addmessageForm: {
        ordermessage: "",
      },
      huifuDialogVisible: false,
      pingjiaDialogVisible: false,
      orderlist: [],
      glorderlist: [],


      user: {
        email: "",
        id: "",
        mobile: "",
        rid: 1,
        username: "",
      },
    };
  },
  methods: {
    async huifu() {
      await fetch(
        `http://localhost:3000/report/huifumessage?id=${this.id}&ordermessage=${this.addmessageForm.ordermessage}`
      )
        .then((res) => res.json())
        .then((res) => {
          this.huifuDialogVisible = false;
          this.addmessageForm.ordermessage = "";
          this.gldingdanlist()
        });
    },
    huifuDialogClosed() {
      this.huifuDialogVisible = false;
    },
    openhuifu(id) {
      this.huifuDialogVisible = true;
      this.id = id;
    },
    pingjiaDialogClosed() {
      this.pingjiaDialogVisible = false;
    },
    async dingdanlist() {
      await fetch(
        `http://localhost:3000/report/orderlist?username=${this.user.username}`
      )
        .then((res) => res.json())
        .then((res) => {
          this.orderlist = res.data;

          
        });
    },
    async gldingdanlist() {
      await fetch(
        `http://localhost:3000/report/glorderlist?`
      )
        .then((res) => res.json())
        .then((res) => {
            this.glorderlist = res.data.filter((p) => {
        return p.ordermessage !=0;
      })
   

         
        });
    },
    openliuyan(id) {
      this.pingjiaDialogVisible = true;
      this.id = id;
    },
    async liuyan() {
      await fetch(
        `http://localhost:3000/report/dingdanmessage?id=${this.id}&ordermessage=${this.addmessageForm.ordermessage}`
      )
        .then((res) => res.json())
        .then((res) => {
          this.pingjiaDialogVisible = false;
          this.addmessageForm.ordermessage = "";
        });
        this.gldingdanlist()

    },
  },
  created() {
    var user = sessionStorage.getItem("user");
    this.user = JSON.parse(user);
    this.dingdanlist();
    this.gldingdanlist()
  },
};
</script>

<style>
</style>