<template>
  <div class="mx-3 my-8 flex">
    <el-avatar
      class="mr-4 w-10 h-10"
      :src="this.$imgUrl + commentData.userPublic.avatar"
    />
    <div class="leading-3 w-full">
      <div class="block my-2 text-sm">
        <span class="text-blue-400 font-bold" v-if="isMine"> {{ commentData.userPublic.name }}: </span>
        <span class="text-yellow-600 font-bold" v-else> {{ commentData.userPublic.name }}: </span>
        <span>
          {{ commentData.content }}
        </span>
      </div>
      <el-image
        v-for="(item, index) in comment.imgSrc"
        :key="index"
        :preview-src-list="comment.imgSrc"
        :initial-index="index"
        class="w-1/5 mr-1 mb-3 h-30"
        :src="item"
        fit="cover"
      >
        <template #placeholder>
          <div
            class="
              w-full
              mr-1
              h-30
              bg-gray-200
              text-gray-400
              flex
              items-center
              justify-center
            "
          >
            Loading..
          </div>
        </template>
        <template #error>
          <div
            class="
              w-full
              mr-1
              h-25
              text-2xl
              flex
              items-center
              justify-center
            "
          >
            <i class="fa-solid fa-image"></i>
          </div>
        </template>
      </el-image>
      <div class="block text-xs">
        {{
          this.$dayjs(commentData.createTime)
            .locale("zh-cn")
            .format("YYYY-MM-DD HH:mm:ss")
        }}
      </div>
    </div>
  </div>
</template>
<script>
import { ref,reactive,onMounted, getCurrentInstance } from "vue";
export default {
  props: ["commentData"],
  setup(props) {
    // 拿到当前实例 获取全局的imgUrl
    const { proxy } = getCurrentInstance(); //关键代码
    const $imgUrl = proxy.$imgUrl; //关键代码

    const comment = reactive({
      imgSrc: [],
    });
    let isMine = ref(false);
    // 解析图片
    function parseImage() {
      if (props.commentData.images) {
        let str = JSON.parse(props.commentData.images);
        for (const item of str) {
          comment.imgSrc.push($imgUrl + item);
        }
      }
    }
    parseImage();
    onMounted(() => {
      if (localStorage.getItem("loginInfo") !== "") {
        // 获取localStorage中的loginInfo
        const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
        // 如果有table.tableData.userPublic不等于null
        if (props.commentData.userPublic !== null) {
          if (loginInfo.id === props.commentData.userPublic.id)
            isMine.value = true;
          else isMine.value = false;
        }
      }
    });
    return {
      comment,
      isMine
    };
  },
};
</script>
<style lang="">
</style>