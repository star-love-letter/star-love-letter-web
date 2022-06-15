<template>
  <div
    class="
      p-4
      w-120
      mb-5
      mx-5
      text-gray-600
      <xl:w-90 <xl:mx-3
      <lg:w-120 <lg:mx-5
      <md:w-full
      box-border
      <md:mb-5 <md:mx-0 <md:p-2
    "
    style="background-color: #ffebc0"
  >
    <header class="border-b-1 border-gray-400 border-dotted pb-2 text-center">
      <div class="flex items-center justify-center">
        <span>{{ table.tableData.sender }}</span>
        <img class="w-6 mx-4 my-2" src="../assets/img/heart2.png" alt="" />
        <span>{{ table.tableData.recipient }}</span>
        <span class="text-xs mx-5" v-if="table.tableData.state === 1"
          >(我的帖子)</span
        >
        <span class="text-xs mx-5" v-else-if="table.tableData.state === -1"
          >(已封禁)</span
        >
      </div>
    </header>
    <div class="m-3 flex items-center">
      <el-avatar
        v-if="table.tableData.anonymous || table.tableData.userPublic === null"
        class="mr-4 w-12 h-12"
        :src="avatarAnonymous"
      />
      <el-avatar
        v-else
        class="mr-3 w-12 h-12"
        :src="table.imgUrl + table.tableData.userPublic.avatar"
      />
      <div class="leading-3">
        <div v-if="table.tableData.anonymous" class="block my-2 text-sm">
          <span class="font-bold">
            [匿名<span v-if="table.tableData.userPublic !== null" class="text-xs pl-2">本人发布</span>]
          </span>
        </div>
        <span
          v-else-if="table.tableData.userPublic === null"
          class="block my-2 text-sm"
          >[BUG]</span
        >
        <span v-else class="block my-2">{{
          table.tableData.userPublic.name
        }}</span>
        <div class="block text-xs">
          {{
            this.$dayjs(table.tableData.createTime)
              .locale("zh-cn")
              .format("YYYY-MM-DD HH:mm:ss")
          }}
        </div>
      </div>
    </div>
    <main class="content mx-4 ml-18">
      <p class="my-3">{{ table.tableData.content }}</p>
      <div class="flex flex-wrap">
        <el-image
          v-for="(item, index) in table.imgSrc"
          :key="index"
          class="w-3/10 mr-1 h-28 <xl:h-25 <lg:h-32 <sm:h-22"
          :src="item"
          :preview-src-list="table.imgSrc"
          :initial-index="4"
          fit="cover"
        >
          <template #placeholder>
            <div
              class="
                w-full
                mr-1
                h-32
                <xl:h-25
                <lg:h-32
                <sm:h-22
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
                h-32
                <xl:h-25
                <lg:h-32
                <sm:h-22
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
      </div>
    </main>
    <footer class="flex justify-around m-4">
      <div>
        <i class="fa-solid fa-thumbs-up"></i>
        {{ table.tableData.supportCount }}
      </div>
      <div>
        <i class="fa-solid fa-comment"></i>
        {{ table.tableData.commentCount }}
      </div>
      <div><i class="fa-solid fa-share-from-square"></i></div>
    </footer>
  </div>
</template>
<script>
// 静态头像
import avatarAnonymous from "../assets/img/avatar-anonymous1.jpg";
import { reactive } from "vue";
export default {
  props: {
    tableData: Object,
  },
  setup(props) {
    const table = reactive({
      tableData: props.tableData,
      imgSrc: [],
      // imgUrl: "http://39.107.228.202:8089/api/file/image/",
      imgUrl: "http://localhost:8089/api/file/image/",
      // 是否有图片
      hasImg: false,
    });
    // console.log(table.tableData);
    // 解析图片
    function parseImage() {
      if (table.tableData.images) {
        table.hasImg = true;
        let str = JSON.parse(table.tableData.images);
        for (const item of str) {
          table.imgSrc.push(table.imgUrl + item);
        }
      }
    }
    parseImage();
    return {
      table,
      avatarAnonymous,
    };
  },
};
</script>
<style lang="">
</style>