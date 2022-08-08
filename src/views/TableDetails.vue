<template>
  <div class="container px-30 pb-10 m-auto <md:px-10 <md:pb-5 <md:pt-10">
    <Table
      v-for="item in tableDetail.tableData"
      :key="item.id"
      :tableData="item"
      :isDetail="true"
    >
    </Table>
    <div
      class="px-4 pb-8 w-5/7 mx-auto h-auto text-gray-600 <md:w-full"
      style="background-color: #ffebc0"
      @click.capture="comment.emojiVisible = false"
    >
      <div class="releaseComment border-t-1 border-gray-400 border-dotted">
        <div class="mx-3 mt-10 mb-5 flex">
          <div class="commmentAvatar">
            <el-avatar
              class="mr-4 w-10 h-10"
              v-if="tableDetail.isLogin"
              :src="$imgUrl + tableDetail.loginInfo.avatar"
            />
            <div v-else class="mr-4 w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
          <div class="w-11/12">
            <el-input
              v-model.trim="comment.addCommentParam.content"
              :autosize="{ minRows: 2 }"
              type="textarea"
              resize="none"
              :placeholder="tableDetail.isLogin?'发布你的评论':'请登录'"
              maxlength="150"
              show-word-limit
              class="w-full"
              :disabled="!tableDetail.isLogin" 
              
            />
            <div class="flex justify-between my-2">
              <div class="flex" v-if="tableDetail.isLogin">
                <el-popover
                  placement="top"
                  :width="300"
                  v-model:visible="comment.emojiVisible"
                >
                  <template #reference>
                    <i
                      @click="comment.emojiVisible = !comment.emojiVisible"
                      class="fa-regular fa-face-smile text-xl cursor-pointer"
                    ></i>
                  </template>
                  <ChatEmoji @selectEmoji="selectEmoji" />
                </el-popover>
                <el-upload
                  with-credentials
                  list-type="picture"
                  :action="$imgUrl"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :on-error="handleError"
                >
                  <i
                    class="fa-regular fa-image text-xl cursor-pointer ml-5"
                  ></i>
                </el-upload>
              </div>
              <el-button
                type="primary"
                plain
                round
                :disabled="!comment.addCommentParam.content"
                @click="postComment"
                >评论</el-button
              >
            </div>
          </div>
        </div>
        <!-- <div v-else class="noLongin">
          
        </div> -->
      </div>
      <div
        class="text-center font-bold"
        v-if="comment.commentData.length === 0"
      >
        暂无评论
      </div>
      <Comment
        v-for="item in comment.commentData"
        :key="item.id"
        :commentData="item"
      >
      </Comment>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted, watch, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiGetTable } from "../apis/table.js";
import { apiGetCommentList, apiAddComment } from "../apis/comment.js";
import { ElNotification } from "element-plus";
import Qs from "qs";
import Table from "../components/Table";
import Comment from "../components/Comment.vue";
import ChatEmoji from "../components/ChatEmoji.vue";

import { useStore } from "vuex";
export default {
  components: {
    Table,
    Comment,
    ChatEmoji,
  },
  setup() {
    // 拿到当前实例 获取全局的imgUrl
    const { proxy } = getCurrentInstance(); //关键代码
    const $imgUrl = proxy.$imgUrl; //关键代码
    // 创建store实例
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const tableDetail = reactive({
      tableData: [],
      loginInfo: {},
      isLogin: false,
    });
    const comment = reactive({
      emojiVisible: false,
      commentData: [],
      commentParam: {
        pageIndex: 1,
        pageSize: 10,
        tableId: route.query.id,
      },
      addCommentParam: {
        content: "",
        tableId: route.query.id,
        images: "",
      },
      emojiList: {},
    });
    let imgs = [];
    onMounted(() => {
      if (localStorage.getItem("loginInfo") !== "") {
        tableDetail.isLogin = true;
        console.log("已登录");
        tableDetail.loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
      } else {
        console.log("未登录");
      }
    });
    // 上传成功的钩子
    const handleSuccess = (res, file, files) => {
      if (res.code === 200) {
        console.log("上传成功");
        imgs.push(res.data);
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
    const handleError = (error) => {
      // 未登录
      if (error.code === 20001) {
        console.warn(error.message);
      }
    };
    // 移除时的钩子
    const handleRemove = (uploadFile, uploadFiles) => {
      imgs = imgs.filter((item) => {
        return item !== uploadFile.response.data;
      });
      uploadFiles.forEach((file, index, array) => {
        if (file.uid === uploadFile.uid) {
          array.splice(index, 1);
        }
      });
    };
    // 获取详情数据
    apiGetTable(route.query.id).then((res) => {
      tableDetail.tableData.push(res.data);
    });
    // 获取评论数据
    apiGetCommentList(comment.commentParam).then((res) => {
      comment.commentData = res.data;
    });
    // 选择emoji
    function selectEmoji(item) {
      comment.addCommentParam.content += item;
      comment.emojiVisible = false;
    }
    // 发布评论
    function postComment() {
      comment.addCommentParam.images = JSON.stringify(imgs);
      console.log("comment.addCommentParam", comment.addCommentParam);
      apiAddComment(Qs.stringify(comment.addCommentParam)).then((res) => {
        console.log("res", res);
        if ((res.code = 200)) {
          router.go(0);
          ElNotification.success({
            title: "发布成功",
            message: "恭喜你，发布成功",
          });
          comment.addCommentParam.content = "";
          comment.addCommentParam.images = "";
        }
      });
    }
    // 监控store中的userInfo
    watch(
      () => store.state.userInfo,
      (newVal) => {
        console.log(store.state.userInfo);
        if (store.state.userInfo !== "") {
          tableDetail.isLogin = true;
          tableDetail.loginInfo = store.state.userInfo;
        } else {
          tableDetail.isLogin = false;
          tableDetail.loginInfo = "";
        }
      }
    );
    return {
      tableDetail,
      comment,
      selectEmoji,
      handleSuccess,
      handleError,
      handleRemove,
      postComment,
    };
  },
};
</script>
<style>
.el-textarea__inner {
  border-radius: 0.75rem;
}
</style>