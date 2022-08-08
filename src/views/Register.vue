<template>
  <div class="container px-30 pb-10 m-auto <md:px-0 <md:pb-5 <md:pt-10">
    <span class="text-center block text-2xl">注册</span>
    <el-form
      ref="ruleFormRef"
      :model="registerFrom"
      label-width="120px"
      :rules="rulesRegister"
      hide-required-asterisk
      size="large"
      class="
        px-30
        pt-10
        pb-10
        container
        m-auto
        <md:px-0 <md:pb-5 <md:pt-10 <md:w-full
        <lg:px-10 <lg:w-full
        w-180
      "
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerFrom.email" placeholder="请输入邮箱">
        </el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="registerFrom.userName"
          placeholder="请输入用户名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="registerFrom.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="再次输入密码" prop="passwordAgain">
        <el-input
          type="password"
          v-model="registerFrom.passwordAgain"
          placeholder="请再次输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-popover
          placement="top"
          :width="500"
          v-model:visible="register.showCodePopper"
        >
          <div
            class="
              w-full
              h-70
              flex flex-col
              justify-center
              items-center
              p-5
              relative
            "
            v-if="register.showRotateCode === true"
          >
            <p class="text-xl font-bold">获取邮箱验证码</p>
            <div class="popover-close" @click="register.showCodePopper = false">
              +
            </div>
            <div class="w-full">
              <Slider
                :mouseupFun="getEmailCode"
                :status="register.rangeStatus"
                :imgUrl="register.rotateCodeUrl"
                @rotateAngle="(data) => (emailCode.angle = parseInt(data))"
              ></Slider>
            </div>
          </div>
          <div
            class="
              w-full
              h-70
              flex flex-col
              justify-center
              items-center
              p-5
              relative
            "
            v-if="register.authRotateSuccess"
          >
            <p class="text-xl m-10 font-bold">获取邮箱验证码</p>
            <div class="popover-close" @click="register.showCodePopper = false">
              +
            </div>
            <el-input
              placeholder="请输入邮箱验证码"
              v-model="register.addRegister.emailCode"
              clearable
            >
            </el-input>
            <div class="mt-10">
              <el-button @click="Register()" type="primary">完成注册</el-button>
            </div>
          </div>
          <template #reference>
            <el-button
              type="primary"
              class="w-50"
              v-if="register.showCountDownRotateCode === true"
              disabled
              @click="getRotateCode(ruleFormRef)"
              >{{
                "重新获取邮箱验证码" + "(" + register.countDown + ")"
              }}</el-button
            >
            <el-button
              type="primary"
              class="w-50"
              @click="getRotateCode(ruleFormRef)"
              >获取邮箱验证码</el-button
            >
          </template>
        </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { ElNotification } from 'element-plus'
import { reactive, ref } from "vue";
import Slider from "../components/Slider.vue";
import { useRouter } from "vue-router";

import { apiGetEmailCode, apiGetRotateCode, apiAddUser } from "@/apis/user.js";

export default {
  components: {
    Slider,
  },
  setup() {
    const formRef = ref();
    const ruleFormRef = ref();
    // 注册表单数据
    const registerFrom = reactive({
      email: "",
      userName: "",
      password: "",
      passwordAgain: "",
    });
    // 获取邮箱验证码数据
    const emailCode = reactive({
      //旋转度数
      angle: 0,
      email: "",
    });
    // 注册数据
    const register = reactive({
      //判断图片是否为正
      rangeStatus: false,
      timer: null,
      //倒计时
      countDown: 60,
      //是否显示倒计时获取邮箱按钮
      showCountDownRotateCode: false,
      //图片base64
      rotateCodeUrl: "",
      // 是否弹出框
      showCodePopper: false,
      //是否显示旋转验证码
      showRotateCode: false,
      //弹出框的标题
      popoverTitle: "获取邮箱验证码",
      addRegister: {
        email: "",
        emailCode: "",
        name: "",
        password: "",
      },
      authRotateSuccess: false,
    });
    const passwordAgain = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== registerFrom.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    // 验证规则
    const rulesRegister = reactive({
      email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "change" },
        { min: 7, message: "密码必须大于6个字", trigger: "blur" },
        { max: 17, message: "密码必须小于18个字", trigger: "blur" },
      ],
      userName: [
        { required: true, message: "请输入用户名称", trigger: "change" },
        { max: 8, message: "名称不能超过8个字", trigger: "blur" },
      ],
      passwordAgain: [{ validator: passwordAgain, trigger: "change" }],
    });
    //获取旋转验证码
    const getRotateCode = (formEl) => {
      register.authRotateSuccess = false;

      register.rangeStatus = false;
      register.countDown = 60;
      //  this.popoverTitle = "获取邮箱验证码";
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          apiGetRotateCode(registerFrom.email)
            .then((res) => {
              if (res.code === 200) {
                register.showCodePopper = true;
                // 将旋转验证码的base64赋值给rotateCodeUrl
                register.rotateCodeUrl = res.data;
                register.showRotateCode = true;
              }
              else {
                ElNotification.error({
                  title: "错误",
                  message: res.message,
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
      register.addRegister.emailCode = "";
    };
    //获取邮箱验证码
    const getEmailCode = () => {
      emailCode.email = registerFrom.email;
      register.rangeStatus = false;
      apiGetEmailCode(emailCode).then((res) => {
        if (res.code === 200) {
          console.log("res", res);
          register.rangeStatus = true;
          setTimeout(() => {
            register.authRotateSuccess = true;
            register.showRotateCode = false;
            register.showCountDownRotateCode = true;
          }, 1000);
          register.timer = setInterval(() => {
            register.countDown--;
            if (register.countDown === 0) {
              clearInterval(register.timer);
              register.showCountDownRotateCode = false;
              register.countDown = 60;
            }
          }, 1000);
        } else {
          ElNotification.error({
            title: "获取邮箱验证码失败",
            message: res.message,
          });
        }
      });
    };
    // 用户注册
    const Register = () => {
      (register.addRegister.email = registerFrom.email),
        (register.addRegister.name = registerFrom.userName),
        (register.addRegister.password = registerFrom.password),
        apiAddUser(register.addRegister)
          .then((res) => {
            console.log("res", res);
            if (res.code === 200) {
              ElNotification.success({
                title: "注册成功",
                message: res.message,
              });
              const router = useRouter()
              router.go(-1);
            } else {
              ElNotification.error({
                title: "注册失败",
                message: res.message,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
    };
    return {
      formRef,
      ruleFormRef,
      register,
      rulesRegister,
      emailCode,
      registerFrom,
      getRotateCode,
      getEmailCode,
      Register,
    };
  },
};
</script>
<style>
.popover-close {
  transform: rotate(45deg);
  position: absolute;
  top: -13px;
  right: 0;
  font-size: 30px;
  cursor: pointer;
}
.popover-title-top {
  font-size: 16px;
  margin-bottom: 30px;
  font-weight: bold;
}
</style>