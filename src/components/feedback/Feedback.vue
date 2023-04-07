<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>反馈管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户投诉</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格数据 -->
    <el-table :data="goodsList" border stripe v-show="this.user.rid === 31">
      <el-table-column type="index" width="200px"></el-table-column>
      <el-table-column
        label="商品名称"
        prop="goods_name"
        width="200px"
      ></el-table-column>
      <el-table-column label="图片" prop="pics" width="140px">
          <template slot-scope="scope">
            <img :src="scope.row.pics" />
          </template>
        </el-table-column>
      <el-table-column label="商品价格" prop="goods_price" width="140px"></el-table-column>
      <el-table-column
        label="商品重量"
        prop="goods_weight"
        width="140px"
      ></el-table-column>
      <el-table-column label="操作" width="230px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="Feedback(scope.row.goods_name)"
            >评价/投诉</el-button
          >
        </template>
      </el-table-column>
    </el-table>
<h3>反馈中心</h3>
    <el-table v-show="this.user.rid === 31" :data="messagesList" border stripe>
      <el-table-column type="index"></el-table-column>

      
      <el-table-column label="用户姓名" prop="names"></el-table-column>

      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="评价内容" prop="content"></el-table-column>
      <el-table-column
        label="回复内容"
        prop="huifu"
      ></el-table-column>

     
     
    </el-table>

    
    <el-table v-show="this.user.rid !== 31" :data="messagesList" border stripe>
      <el-table-column type="index"></el-table-column>

      <el-table-column
        label="姓名"
        prop="names"
        width="140px"
      ></el-table-column>
      <el-table-column
        label="商品名字"
        prop="goods_name"
        width="140px"
      ></el-table-column>
      <el-table-column
        label="手机号"
        prop="phone"
        width="140px"
      ></el-table-column>

      <el-table-column label="内容" prop="content"></el-table-column>
      <el-table-column
        label="回复"
        prop="huifu"
        width="140px"
      ></el-table-column>

      <el-table-column label="评价时间" prop="time" width="140px">
        <template slot-scope="scope">{{ scope.row.time | fmtdates }}</template>
      </el-table-column>

      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="
              openDialogVisible(
                scope.row.id,
                scope.row.content,
                scope.row.goods_name
              )
            "
            >回复</el-button
          >
          <el-button type="danger" size="mini" @click="removeById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 回复对话框 -->
    <el-dialog
      title="回复商品"
      :visible.sync="huifuDialogVisible"
      width="50%"
      @close="huifuDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form :model="addmessageForm" label-width="100px">
        <el-form-item label="商品名字" prop="goods_name">
          <el-input v-model="addmessageForm.goods_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input v-model="addmessageForm.content" disabled></el-input>
        </el-form-item>
        <el-form-item label="评论回复" prop="huifu">
          <el-input v-model="addmessageForm.huifu"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="huifuDialogClosed = false">取 消</el-button>
        <el-button
          type="primary"
          @click="huifuById(addmessageForm.id, addmessageForm.huifu)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加留言的对话框 -->
    <el-dialog
      title="留下您的宝贵意见"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form :model="addmessageForm" label-width="100px">
        <el-form-item label="商品名字" prop="goods_name">
          <el-input v-model="addmessageForm.goods_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="您的名字" prop="names">
          <el-input v-model="addmessageForm.names"></el-input>
        </el-form-item>
        <el-form-item label="您的手机号" prop="phone">
          <el-input v-model="addmessageForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="您的宝贵意见" prop="content">
          <el-input v-model="addmessageForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addmessage">确 定</el-button>
      </span>
    </el-dialog>
    <br />
    <br />
    <div>
      商家回复的不满意？<a href="http://localhost:8080/#/glfeedbacks"
        >点击向管理员反馈您的意见</a
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addmessageForm: {
        id:-1,
        names: "",
        content: "",
        huifu: "",
        goods_name: "",
        phone: "",
      },
      huifuDialogVisible: false,
      addDialogVisible: false,
      user: {
        email: "",
        id: "",
        mobile: "",
        rid: -1,
        username: "",
      },
      
      messagesList: [],
      goodsList: [
     
      ],
      // 商品总数
      total: 0,
    };
  },
  created() {
    var user = sessionStorage.getItem("user");
    this.user = JSON.parse(user);
    this.getGoodsList();
    this.getMessageList();
    
  },

  methods: {
    openDialogVisible(id,content,names){
      this. huifuDialogVisible = true;
      this.addmessageForm.id = id;
      this.addmessageForm.content = content;
      this.addmessageForm.goods_name = names;

    },
    // 回复评论
    huifuById(id,huifu){
      fetch(`http://localhost:3000/db/revise?id=${id}&huifu=${huifu}`)
        .then((res) => res.json())
        .then((res) => {
          this.getMessageList();
          this. huifuDialogVisible = false;

        });
    },
    // 删除评论
    removeById(id){
      fetch(`http://localhost:3000/db/delete?id=${id}`)
        .then((res) => res.json())
        .then((res) => {
          
          this.getMessageList();

        });
    },
    // 发送添加请求
    addmessage() {
      // post请求
      fetch(
        `http://localhost:3000/db/addmessage?names=${this.addmessageForm.names}&content=${this.addmessageForm.content}&huifu=${this.addmessageForm.huifu}&goods_name=${this.addmessageForm.goods_name}&phone=${this.addmessageForm.phone}&`
      )
        .then((res) => res.json())
        .then((res) => {
          this.getMessageList();
          this.addDialogVisible = false, 
          this.addmessageForm = {};
        });
    },
    huifuDialogClosed(){
      this. huifuDialogVisible = false;

    },
    addDialogClosed() {
      this.addDialogVisible = false;
    },
    // 打开添加留言
    Feedback(names) {
      this.addDialogVisible = true;
      this.addmessageForm.goods_name = names;
    },

    // 留言对话框

    getMessageList() {
      fetch(`http://localhost:3000/db/query`)
        .then((res) => res.json())
        .then((res) => {
          this.messagesList = res.data;
          // console.log(this.messagesList);

        });
    },
    // 根据分页获取对应的商品列表
     getGoodsList() {
       fetch(`http://localhost:3000/good/yhquery`)
        .then((res) => res.json())
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].pics = res.data[i].pics.replace(/\"/g, "");
          }
          this.goodsList = res.data;
          console.log(this.goodsList);

        });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getGoodsList();
    },
  },
};
</script>

<style lang="less" scoped>
img {
  width: 100px;
  height: 100px;
}
</style>
