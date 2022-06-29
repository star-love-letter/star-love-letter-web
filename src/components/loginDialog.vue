<template>
  <el-dialog
    v-model="showDialog"
    title="登录"
    center
    width="40%"
    @close="clearLoginFrom"
  >
    <div class="w-4/5 m-auto">
      <el-input
        v-model="loginFrom.userStr"
        placeholder="请输入用户id或者邮箱"
        size="large"
        class="m-2"
      >
        <template #prepend>
          <i class="fa-solid fa-user"></i>
        </template>
      </el-input>
      <el-input
        v-model="loginFrom.password"
        placeholder="请输入密码"
        show-password
        size="large"
        class="m-2"
        @keydown.enter="loginFn()"
      >
        <template #prepend>
          <i class="fa-solid fa-lock"></i>
        </template>
      </el-input>
      <router-link to="@/view/Login" class="float-right">忘记密码?</router-link>
      <span class="float-left ml-2 text-red-500" v-if="errorLoginMsg !== ''">{{
        errorLoginMsg
      }}</span>
    </div>
    <template #footer>
      <span>
        <el-button type="primary" @click="loginFn()">登录</el-button>
        <el-button @click="login.showLoginView = false">注册</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { apiLogin } from "@/apis/user";

export default {
  props: {
    isShow: Boolean,
  },
  emits: ["isSonShow"],
  setup(props, context) {
    // 创建store实例
    const store = useStore();
    let showDialog = ref(false);
    let errorLoginMsg = ref("");
    watch(props, (val) => {
      showDialog.value = val.isShow;
    });
    watch(showDialog, (val) => {
      context.emit("isSonShow", val);
    });
    const loginFrom = reactive({
      userStr: "",
      password: "",
    });
    // 清空登录表单
    function clearLoginFrom() {
      loginFrom.userStr = "";
      loginFrom.password = "";
    }
    // 登录
    function loginFn() {
      apiLogin(loginFrom).then((res) => {
        console.log(res);
        if (res.code === 200) {
          // 登录成功
          store.commit("changeLogin", true);
          store.commit("getUserInfo", res.data);
          // 将登录信息传递放在localStorage中
          localStorage.setItem("loginInfo", JSON.stringify(res.data));
          // 清空登录表单
          showDialog.value = false;
          clearLoginFrom();
          errorLoginMsg.value = "";
        } else {
          errorLoginMsg.value = res.message;
          loginFrom.password = "";
        }
      });
    }
    return {
      showDialog,
      loginFrom,
      clearLoginFrom,
      loginFn,
      errorLoginMsg,
    };
  },
};
</script>