<template>
  <div
    class="relative my-6"
    @mousemove="table.detail = true"
    @mouseleave="table.detail = false"
  >
    <el-image
      v-if="table.isFirstImg"
      :src="table.imgSrc"
      fit="cover"
      class="w-100 h-100 <xl:w-80 <xl:h-80 <md:w-full <md:h-100 <sm:w-full <sm:h-full"
      lazy
    >
      <template #placeholder>
        <div
          class="
            bg-gray-300
            text-gray-600
            flex
            items-center
            justify-center
            w-100
            h-100
            <xl:w-80 <xl:h-80
            <md:w-full <md:h-100
            <sm:w-full <sm:h-full
          "
        >
          Loading..
        </div>
      </template>
      <template #error>
        <div
          class="
            text-2xl
            flex
            items-center
            justify-center
            w-100
            h-100
            <xl:w-80 <xl:h-80
            <md:w-full <md:h-100
            <sm:w-full <sm:h-full
          "
        >
          <i class="fa-solid fa-image"></i>
        </div>
      </template>
    </el-image>
    <el-image
      v-else
      :src="table.imgSrc"
      fit="cover"
      lazy
      class="w-full h-100 <xl:h-80 <md:w-full <md:h-100 <sm:w-full <sm:h-full"
    >
      <template #placeholder>
        <div
          class="
            bg-gray-300
            text-gray-600
            flex
            items-center
            justify-center
            w-full
            h-100
            <xl:h-80
            <md:w-full <md:h-100
            <sm:w-full <sm:h-full
          "
        >
          Loading..
        </div>
      </template>
      <template #error>
        <div
          class="
            text-2xl
            flex
            items-center
            justify-center
            w-full
            h-100
            <xl:h-80
            <md:w-full <md:h-100
            <sm:w-full <sm:h-full
          "
        >
          <i class="fa-solid fa-image"></i>
        </div>
      </template>
    </el-image>
    <transition
      name="animate__animated animate__bounce"
      enter-active-class="animate__bounceIn"
      leave-active-class="animate__bounceOut"
    >
      <div
        class="
          bg-red-500 bg-opacity-70
          absolute
          w-full
          h-full
          top-0
          p-4
          rounded
        "
        v-show="table.detail"
      >
        <div
          class="
            border-gray-200 border-2 border-solid
            rounded
            w-full
            h-full
            box-border
            flex flex-col
            justify-center
            items-center
            p-4
            text-white text-lg
          "
        >
          <p>{{ table.tableData.sender }} to {{ table.tableData.recipient }}</p>
          <p>
            {{ table.tableData.content }}
          </p>
          <p>
            发表于：
            {{
              this.$dayjs(table.tableData.createTime)
                .locale("zh-cn")
                .format("YYYY-MM-DD HH:mm:ss")
            }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { reactive } from "vue";
import { apiGetTable } from "../apis/table.js";
export default {
  props: {
    tableId: Number,
    isFirstImg: Boolean,
  },
  setup(props) {
    const table = reactive({
      tableData: {},
      detail: false,
      isFirstImg: false,
      imgSrc: "",
      imgUrl: "http://39.107.228.202:8089/api/file/image/",
    });
    table.isFirstImg = props.isFirstImg;
    // 获取帖子数据
    function getTable(id) {
      return new Promise((resolve, reject) => {
        apiGetTable(id).then((res) => {
          resolve(res);
        });
      });
    }
    async function getTableData() {
      const res = await getTable(props.tableId);
      table.tableData = res.data;
      // 解析图片
      if (table.tableData.images) {
        let str = JSON.parse(table.tableData.images);
        table.imgSrc = table.imgUrl + String(str);
      }
    }
    getTableData();
    return {
      table,
    };
  },
};
</script>
<style lang="">
</style>