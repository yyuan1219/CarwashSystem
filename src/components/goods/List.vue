<template>
  <div>
    
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            v-if="this.user.rid != 31"
            type="primary"
            @click="goAddPage"
            >添加项目</el-button
          >
          <template v-if="this.user.rid != 31">
            <download-excel
              class="export-excel-wrapper"
              :data="goodsList"
              :header="goodsList.name"
              name="项目列表信息.xls"
            >
              <el-button type="success">导出全部项目信息</el-button>
            </download-excel>
          </template>

          <el-button
            v-if="this.user.rid === 31"
            type="primary"
            @click="goshoppingcar"
            >购物车</el-button
          >
        </el-col>
      </el-row>
      <!-- 商家项目列表 -->

      <el-table :data="filgoodsList" border stripe v-if="this.user.rid != 31">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="项目名称" prop="goods_name" width="340px"></el-table-column>
        <el-table-column label="图片" prop="pics" width="140px">
          <template slot-scope="scope">
            <img :src="scope.row.pics" />
          </template>
        </el-table-column>
        <el-table-column
          label="项目价格(元)"
          prop="goods_price"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="项目重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column
          label="项目数量(kg)"
          prop="goods_number"
          width="110px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="creattime" width="140px">
          <template slot-scope="scope">{{
            scope.row.creattime | fmtdates
          }}</template>
        </el-table-column>
        <el-table-column label="审核进程" prop="good_state" width="140px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.goods_state === '0'">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.goods_state === '1'"
              >审核通过</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.goods_state === '2'"
              >被驳回</el-tag
            >
          </template>
        </el-table-column>

<!-- 管理员 -->
        <el-table-column label="操作" width="330px" v-if="(this.user.rid != 34&31)">
          
          <template slot-scope="scope">
            
            <el-button  type="success" size="mini" @click="shenhe(scope.row.goods_id)"
              >项目审核</el-button
            >
            <el-button  size="mini" @click="chakan(scope.row)"
              >项目查看</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            >下架</el-button>
          </template>
          
        </el-table-column>
        <!-- 商家操作 -->
        <el-table-column label="操作" width="330px" v-if="(this.user.rid == 34)">
          
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="reviesById(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          
          </template>
          
        </el-table-column>
        
      </el-table>
      <!-- 用户项目列表 -->
      <el-table :data="filyhgoodsList" border stripe v-if="this.user.rid === 31">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="项目名称" prop="goods_name"></el-table-column>
        <el-table-column label="图片" prop="pics" width="140px">
          <template slot-scope="scope">
            <img :src="scope.row.pics" />
          </template>
        </el-table-column>
        <el-table-column
          label="项目价格(元)"
          prop="goods_price"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="项目重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column
          label="项目数量(kg)"
          prop="goods_number"
          width="110px"
        ></el-table-column>

        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="addgood(scope.row)"
              >加入购物车</el-button
            >
          </template>
        </el-table-column>
      </el-table>

 <!-- 修改项目的对话框 -->
 <el-dialog
        title="查看项目信息"
        :visible.sync="chakanDialogVisible"
        width="50%"
        @close="chakanDialogClosed"
      >
        <!-- 内容主体 -->

        <el-form :model="editGoodForm" label-width="70px">
          <el-form-item label="项目姓名" prop="goods_name">
            <el-input v-model="editGoodForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="项目价格" prop="goods_price">
            <el-input v-model="editGoodForm.goods_price" disabled></el-input>
          </el-form-item>
          <el-form-item label="项目重量" prop="goods_weight">
            <el-input v-model="editGoodForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="项目数量" prop="goods_number">
            <el-input v-model="editGoodForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="项目介绍" prop="goods_introduce">
            <el-input v-model="editGoodForm.goods_introduce"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="chakanDialogVisible = false">确定</el-button>
          
        </span>
      </el-dialog>


      <!-- 申请对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
      >
        <span>请仔细考虑申请内容</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="shenqingstatus('2')">申请驳回</el-button>
          <el-button type="primary" @click="shenqingstatus('1')"
            >请求通过</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改项目的对话框 -->
      <el-dialog
        title="修改项目信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <!-- 内容主体 -->

        <el-form :model="editGoodForm" label-width="70px">
          <el-form-item label="项目姓名" prop="goods_name">
            <el-input v-model="editGoodForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="项目价格" prop="goods_price">
            <el-input v-model="editGoodForm.goods_price" disabled></el-input>
          </el-form-item>
          <el-form-item label="项目重量" prop="goods_weight">
            <el-input v-model="editGoodForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="项目数量" prop="goods_number">
            <el-input v-model="editGoodForm.goods_number"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGood(editGoodForm)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 分页区域
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination> -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: -1,
      centerDialogVisible: false,
      user: {
        email: "",
        id: "",
        mobile: "",
        rid: -1,
        username: "",
      },
      query: "",
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
      },
      // 购物车列表信息
      cargoodlist: [],
      // 审核
      shenhelist: {
        id: -1,
      },
      // 项目列表
      goodsList: [],
      // 过滤后的项目列表
      // filgoodsList: [],

      // 非用户项目列表

      yhgoodsList: [],
      // 项目总数
      total: 35,
      picInfo: [],
      editDialogVisible: false,
      chakanDialogVisible: false,

      editGoodForm: {},
    };
  },
  computed: {
   
    filgoodsList() {
      return this.goodsList.filter((p) => {
        return p.goods_name.indexOf(this.query) !== -1;
      });
    },
    filyhgoodsList() {
      return this.yhgoodsList.filter((p) => {
        return p.goods_name.indexOf(this.query) !== -1;
      });
    },
  },
  // watch: {
  //   query(val) {
  //     this.filgoodsList = this.goodsList.filter((p) => {
  //       console.log(p.goods_name);
  //       return p.goods_name.indexOf(val) !== -1;
  //     });
  //   },
  // },
  created() {
    var user = sessionStorage.getItem("user");
    this.user = JSON.parse(user);
    if (this.user.rid != 31) {
      this.getGoodsList();
    }
    if (this.user.rid === 31) {
      this.getyhGoodsList();
    }
  },
  methods: {
    chakan(goodsList){
      console.log(goodsList);
      this.editGoodForm = goodsList;

      this.chakanDialogVisible=true
    },

    async editGood(editGoodForm) {
      var goods_name = editGoodForm.goods_name;
      var goods_price = editGoodForm.goods_price;
      var goods_weight = editGoodForm.goods_weight;
      var goods_number = editGoodForm.goods_number;
      var goods_id = editGoodForm.goods_id;

      //  var editGoodForm = JSON.stringify(editGoodForm)
      await fetch(
        `http://localhost:3000/good/revisecontext?goods_name=${goods_name}&goods_price=${goods_price}&goods_weight=${goods_weight}&goods_number=${goods_number}&goods_id=${goods_id}`
      )
        .then((res) => res.json())
        .then((res) => {
          this.editDialogVisible = false;
          this.getGoodsList();
          this.$message.success("修改项目成功！");
        });
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.editDialogVisible = false;
    },
    chakanDialogClosed() {
      this.chakanDialogVisible = false;
    },

    reviesById(goodsList) {
      this.editGoodForm = goodsList;
      this.editDialogVisible = true;
    },

    // 发送修改状态请求
    async shenqingstatus(status) {
      await fetch(
        `http://localhost:3000/good/revise?goodsstatus=${status}&id=${this.shenhelist.id}`
      )
        .then((res) => res.json())
        .then((res) => {
          this.centerDialogVisible = false;
          this.getGoodsList();
        });
    },
    // 打开审核对话框
    shenhe(id) {
      this.shenhelist.id = id;
      this.centerDialogVisible = true;
    },

    addgood(message) {
      this.cargoodlist.push(message);
      window.sessionStorage.setItem(
        "cargoodlist",
        JSON.stringify(this.cargoodlist),
        this.$message.success("加入购物车成功！")
      );
    },
    // 用户项目列表发送
    async getyhGoodsList() {
      await fetch(`http://localhost:3000/good/yhquery`)
        .then((res) => res.json())
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].pics = res.data[i].pics.replace(/\"/g, "");
          }
          this.yhgoodsList = res.data;
        });
    },
    // 非用户项目列表发送
    async getGoodsList() {
      await fetch(`http://localhost:3000/good/query`)
        .then((res) => res.json())
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].pics = res.data[i].pics.replace(/\"/g, "");
          }
          this.goodsList = res.data;
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
    // 通过Id删除项目
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除或下架该项目, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        de;
        return this.$message.info("已取消删除！");
      }
      await fetch(`http://localhost:3000/good/delete?id=${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error("删除项目失败！");
          }
          this.$message.success("操作成功！");
          this.getGoodsList();
        });
    },
    goAddPage() {
      this.$router.push("/goods/add");
    },
    goshoppingcar() {
      this.$router.push("/goods/car");
    },
  },
};
</script>

<style lang="less" scoped>
.export-excel-wrapper {
  float: right;
  width: 50px;
}
img {
  width: 100px;
  height: 100px;
}
</style>
