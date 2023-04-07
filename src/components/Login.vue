<template>
  <div class="login_container">
    <img src="../assets/logo.jpg" alt="" >
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.jpg" alt="avatar" />
      </div>
      <!-- 登录表单 -->
      <div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="60px"
          class="login_form"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="iconfont icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              prefix-icon="iconfont icon-3702mima"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="Registerpage">注册</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="注册用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 内容主体 -->
        <el-form :model="addUserForm" ref="addUserFormRef" label-width="100px">
          <el-form-item label="账号/用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="注册身份" label-width="100px">
            <!-- 如果seLect的绑定的数据的值和 option的value一样，
            就会显示该option的Label值 -->
            <el-select v-model="addUserForm.rid">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option
                :label="item.roleName"
                :value="item.id"
                v-for="(item, i) in rolelist"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 用户添加
      addUserForm: {
        username: "123456",
        password: "123456",
        email: "a365100916@qq.com",
        mobile: "13687598695",
        rid: -1,
      },
      rolelist: [],
      // 分配角色
      currRoleId: -1,

      addDialogVisible: false,
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    addDialogClosed() {
      this.addDialogVisible = false;
    },
    // 添加用户
    addUser() {
      // 提交请求前，表单预验证
      this.$refs.addUserFormRef.validate(async (valid) => {
        // 表单预校验失败
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg);
        } else {
          this.$message.success(res.meta.msg);
        }
        // 隐藏添加用户对话框
        this.addUserForm = {};
        this.addDialogVisible = false;
      });
    },
    //打开注册页面
    async Registerpage() {
      this.addDialogVisible = true;
      const { data: res } = await this.$http.post("login", this.loginForm);
      window.sessionStorage.setItem("token", res.data.token);
      // 获取角色列表
      const res1 = await this.$http.get(`roles`);
      this.rolelist = res1.data.data;
    },
    login() {
      // 表单预验证
      // valid：bool类型
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return false;
        // this.$http.post('login', this.loginForm): 返回值为promise
        // 返回值为promise，可加await简化操作 相应的也要加async
        const { data: res } = await this.$http.post("login", this.loginForm);
        window.sessionStorage.setItem("user", JSON.stringify(res.data)); //存储user对象

        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
          window.sessionStorage.clear();
        }else{
          this.$message.success(res.meta.msg);
        }

        // 1、将登陆成功之后的token, 保存到客户端的sessionStorage中; localStorage中是持久化的保存
        //   1.1 项目中出现了登录之外的其他API接口，必须在登陆之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 2、通过编程式导航跳转到后台主页, 路由地址为：/home
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
/* // lang="less" 支持less格式
// scoped vue的指令，只在当前组件生效 */
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 360px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 35%;
  top: 30%;
  background-color: #fff;

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 60px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
.info {
  font-size: 13px;
  margin: 10px 15px;
}
</style>
