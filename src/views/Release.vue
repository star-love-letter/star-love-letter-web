<template >
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    label-width="120px"
    :rules="rulesRelease"
    class="
      px-30
      pt-20
      pb-10
      container
      m-auto
      <md:px-10 <md:pb-5 <md:pt-10
      <lg:px-10
      w-200
    "
  >
    <el-form-item label="表白者名称" prop="sender">
      <el-input v-model="ruleForm.sender"></el-input>
    </el-form-item>
    <el-form-item label="表白者性别" prop="senderGender">
      <el-select
        v-model="ruleForm.senderGender"
        placeholder="Select"
        style="width: 115px"
      >
        <el-option label="男生" :value="1"></el-option>
        <el-option label="女生" :value="2"></el-option>
        <el-option label="保密" :value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="被表白者名称" prop="recipient">
      <el-input v-model="ruleForm.recipient"></el-input>
    </el-form-item>
    <el-form-item label="被表白者性别" prop="recipientGender">
      <el-select
        v-model="ruleForm.recipientGender"
        placeholder="Select"
        style="width: 115px"
      >
        <el-option label="男生" :value="1"></el-option>
        <el-option label="女生" :value="2"></el-option>
        <el-option label="保密" :value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="上传图片" prop="images">
      <el-upload
        v-if="isLogin"
        with-credentials
        :action="uploadUrl"
        list-type="picture-card"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :on-error="handleError"
        :multiple="true"
        accept="image/jpeg,image/gif,image/png"
        :limit="9"
      >
        <i class="fa-solid fa-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="表白内容" prop="content">
      <el-input
        v-model="ruleForm.content"
        :rows="2"
        type="textarea"
        placeholder="Please input"
      ></el-input>
    </el-form-item>
    <div class="flex">
      <el-form-item label="是否邮箱通知" prop="notifyEmail">
        <el-switch v-model="ruleForm.notifyEmail"></el-switch>
      </el-form-item>
      <el-form-item label="是否匿名" prop="anonymous">
        <el-switch v-model="ruleForm.anonymous"></el-switch>
      </el-form-item>
    </div>

    <el-form-item class="flex justify-center">
      <el-button
        type="primary"
        :disabled="!isLogin"
        @click="submitForm(ruleFormRef)"
        >发布</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">清空</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import type {
  FormInstance,
  FormRules,
  ElMessage,
  UploadProps,
} from "element-plus";
import Qs from "qs";
import { ElNotification } from "element-plus";
const { apiUserInfo }: any = require("@/apis/user");
const { addTable }: any = require("@/apis/table");

const router = useRouter();
const formRef = ref<FormInstance>();
const ruleFormRef = ref<FormInstance>();
const uploadUrl = ref(process.env.VUE_APP_BASEURL+"/api/file/image/");

// 判断是否登录
let isLogin = ref(false);
// 提交的数据
const ruleForm = reactive({
  sender: "",
  senderGender: Number(0),
  recipient: "",
  recipientGender: Number(0),
  notifyEmail: false,
  images: "",
  content: "",
  anonymous: false,
});
// 图片数组
let imgs: any = ref([]);
// 验证规则
const rulesRelease = reactive<FormRules>({
  sender: [
    { required: true, message: "请输入你的名字", trigger: "blur" },
    { max: 6, message: "长度不能超过 6 个字符", trigger: "blur" },
  ],
  senderGender: [
    { required: true, message: "请选择你的性别", trigger: "change" },
  ],
  recipient: [{ required: true, message: "请输入TA的名字", trigger: "change" }],
  recipientGender: [
    { required: true, message: "请选择TA的性别", trigger: "change" },
  ],
  content: [
    { required: true, message: "请输入表白内容", trigger: "change" },
    { max: 160, message: "长度不能超过 160 个字符", trigger: "blur" },
  ],
});
// 发布帖子
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (imgs.value.length !== 0) {
        ruleForm.images = JSON.stringify(imgs.value);
      }
      // 发布帖子
      addTable(Qs.stringify(ruleForm)).then((res: any) => {
        console.log(res);
        if ((res.code = 200)) {
          ElNotification.success({
            title: "发布成功",
            message: "恭喜你，发布成功",
          });
          router.push("/table");
        }
      });
    }
  });
};
onMounted(() => {
  // 获取用户信息---判断是否登录
  apiUserInfo().then((res: any) => {
    if (res.code === 200) {
      isLogin.value = true;
    }
    // 未登录
    if (res.code === 20001) {
      ElNotification({
        title: "Warning",
        message: "登录已失效，请重新登录",
        type: "warning",
      });
      isLogin.value = false;
    }
  });
});
// 创建store实例
const store = useStore();
watch(store.state, (newVal: any) => {
  isLogin.value = newVal.isLogin;
});
// 清空表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
// 上传成功的钩子
const handleSuccess: UploadProps["onSuccess"] = (res: any, file, files) => {
  if (res.code === 200) {
    console.log("上传成功");
    imgs.value.push(res.data);
    console.log(imgs);
    return;
  } else {
    ElNotification({
      title: "Warning",
      message: res.message,
      type: "error",
    });
    console.log(res);
    handleError(res, file, files);
    handleRemove(file, files);
  }
};
// 上传失败的钩子
const handleError: UploadProps["onError"] = (error: any) => {
  // 未登录
  if (error.code === 20001) {
    console.warn(error.message);
  }
};
// 移除时的钩子
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  uploadFiles.forEach((file: any, index, array) => {
    if (file.uid === uploadFile.uid) {
      array.splice(index, 1);
    }
  });
};
</script>