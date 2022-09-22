<template>
  <div class="container px-30 pb-10 m-auto <md:px-0 <md:pb-5 <md:pt-10">
    <span class="text-center block text-2xl">修改密码</span>
    <el-form
      ref="ruleFormRef"
      :model="updatePwdForm"
      label-width="120px"
      :rules="rulesUpdate"
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
        <el-input v-model="updatePwdForm.email" placeholder="请输入邮箱">
        </el-input>
      </el-form-item>
      <el-form-item label="邮箱验证码" prop="emailCode">
        <el-input
          v-model="updatePwdForm.emailCode"
          placeholder="请输入邮箱验证码"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input
          v-model="updatePwdForm.newPwd"
          placeholder="请输入用户名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="再次输入新密码" prop="newPwdAgain">
        <el-input
          v-model="updatePwdForm.newPwd"
          placeholder="请输入用户名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-popover placement="top" :width="500" trigger="click">
          <template #reference>
            <el-button type="primary" class="w-50">获取邮箱验证码</el-button>
          </template>
        </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { ElNotification } from 'element-plus';
  import { reactive, ref } from 'vue';
  import Slider from '../components/Slider.vue';
  import { useRouter } from 'vue-router';

  export default {
    components: {
      Slider,
    },
    setup() {
      const formRef = ref();
      const ruleFormRef = ref();
      // 注册表单数据
      const updatePwdForm = reactive({
        email: '',
        emailCode: '',
        newPwd: '',
      });
      // 获取邮箱验证码数据
      const emailCode = reactive({
        //旋转度数
        angle: 0,
        email: '',
      });
      const passwordAgain = (value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== registerFrom.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      // 验证规则
      const rulesUpdate = reactive({
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ],
        newPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 7, message: '密码必须大于6个字', trigger: 'blur' },
          { max: 17, message: '密码必须小于18个字', trigger: 'blur' },
        ],
        emailCode: [
          { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
        ],
        newPwdAgain: [{ validator: passwordAgain, trigger: 'change' }],
      });
      return {
        formRef,
        ruleFormRef,
        emailCode,

        updatePwdForm,
        rulesUpdate,
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