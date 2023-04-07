<template>
  <div >
    <!-- 面包屑导航区 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      v-show="this.user.rid !== 31"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>反馈管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员留言</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-show="this.user.rid === 31">
    <div >
        尊敬的用户：
        <br>
    您好！为了给您提供更好的产品和服务，我们希望收集您使用京东首页时的看法或建议。对您的配合和支持表示衷心感谢！
    </div>
    
    <div class="guanli">
      1.
      为了方便我们与您联系，可填写您的邮箱信息。（选填，信息仅作为内部资料绝不外泄）
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item>
        <el-input v-model="form.message"></el-input>
      </el-form-item>
      <div class="guanli">2.
        反馈类型</div>
      <el-form-item>
        <el-select v-model="form.region" placeholder="请选择反馈类型">
          <el-option label="商家回复不满意" value="商家回复不满意"></el-option>
          <el-option label="商品价格太高" value="商品价格太高"></el-option>
        </el-select>
      </el-form-item>

      
      <div class="guanli">
        3.
        如果您在使用洗车系统时，有什么好或不好的地方，请在此留言！我们会关注您的反馈，不断优化产品，为您提供更好的服务！
      </div>
      <el-form-item>
        <el-input type="textarea" v-model="form.descs"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addmessage">立即反馈</el-button>
      </el-form-item>
    </el-form>
</div>
<el-table  :data="messagesList" border stripe v-show="(this.user.rid !== 31)">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="邮箱"
        prop="message"
        width="140px"
      ></el-table-column>
      <el-table-column
        label="留言内容"
        prop="descs"
        width="140px"
      ></el-table-column>
      <el-table-column
        label="类型"
        prop="region"
        width="140px"
      ></el-table-column>
      
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
            @click="openDialogVisible(scope.row.id,scope.row.descs)"
            >回复</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="removeById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 回复对话框 -->
    <el-dialog
      title="回复"
      :visible.sync="huifuDialogVisible"
      width="50%"
      @close="huifuDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form :model="form" label-width="100px">
        
        <el-form-item label="评论内容" prop="descs" >
          <el-input v-model="form.descs" disabled></el-input>
        </el-form-item>
        <el-form-item label="评论回复" prop="huifu">
          <el-input v-model="form.huifu"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="huifuDialogClosed = false">取 消</el-button>
        <el-button type="primary" @click="huifuById(form.id,form.huifu)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      user: {
        email: "",
        id: "",
        mobile: "",
        rid: -1,
        username: "",
      },
      huifuDialogVisible: false,
      form: {
        id:-1,
        message: "",
        region:'',
        descs: "",
        huifu:''
      },
      messagesList:[]
    };
  },
  created() {
    var user = sessionStorage.getItem("user");
    this.user = JSON.parse(user);
    this.getMessageList()
  },
  methods: {
    huifuDialogClosed(){
      this. huifuDialogVisible = false;
    },
    openDialogVisible(id,descs){
      this.huifuDialogVisible = true;
      this.form.id = id;
      this.form.descs = descs;

    },
     // 删除评论
     removeById(id){
      fetch(`http://localhost:3000/db/gldelete?id=${id}`)
        .then((res) => res.json())
        .then((res) => {
          this.getMessageList();

        });
    },
    getMessageList() {
      // 留言对话框
      fetch(`http://localhost:3000/db/glquery`)
        .then((res) => res.json())
        .then((res) => {
          this.messagesList=res.data
        });
    
    },
    
    // 回复评论
    huifuById(id, huifu) {
      fetch(`http://localhost:3000/db/glrevise?id=${id}&huifu=${huifu}`)
        .then((res) => res.json())
        .then((res) => {
          this.getMessageList();
          this.form={}
          this.huifuDialogVisible = false;
        });
    },
    // 删除评论
    removeById(id) {
      fetch(`http://localhost:3000/db/gldelete?id=${id}`)
        .then((res) => res.json())
        .then((res) => {
          this.getMessageList();
        });
    },
    // 发送添加请求
    addmessage() {
      // post请求
      fetch(
        `http://localhost:3000/db/gladdmessage?message=${this.form.message}&region=${this.form.region}&descs=${this.form.descs}`
      )
        .then((res) => res.json())
        .then((res) => {
          this.getMessageList();
          this.form.message=''
          this.form.descs=''

        });
    },
  },
};
</script>
  
  <style lang="less" scoped>
.guanli {
  margin-top: 30px;
  margin-left: 100px;
}
</style>
  