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
      class="
        w-100
        h-100
        <xl:w-80 <xl:h-80
        <md:w-full <md:h-100
        <sm:w-full <sm:h-full
      "
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
                .locale('zh-cn')
                .format('YYYY-MM-DD HH:mm:ss')
            }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import { reactive } from 'vue';
  import { apiGetPageList } from '../apis/table.js';
  export default {
    props: {
      isFirstImg: Boolean,
    },
    setup(props) {
      const table = reactive({
        tableData: {},
        detail: false,
        isFirstImg: props.isFirstImg,
        imgSrc: '',
        imgUrl: process.env.VUE_APP_BASEURL + '/api/file/image/',
      });
      const PageListParam = {
        pageIndex: 1,
        pageSize: 10,
        rankName: 'support_count',
      };
      // 获取页面数据
      const getPageList = async () => {
        let hotListData = [];
        // 根据点赞数获取数据
        await apiGetPageList(PageListParam).then(res => {
          // 遍历数据 如果有图片就添加到数组
          for (const item of res.data) {
            if (item.images !== null && item.images !== undefined) {
              hotListData.push(item);
              if (hotListData.length === 2) {
                return;
              }
            }
          }
          // 判断有图片的列表
          // 如果有图片的数组列表小于2的话就将页数增加1并递归调用这个函数
          if (hotListData.length < 2) {
            PageListParam.pageIndex++;
            getPageList();
          }
        });
        if (props.isFirstImg) {
          table.tableData = hotListData[0];
          parseImage();
        } else {
          table.tableData = hotListData[1];
          parseImage();
        }
        console.log('table.tableData', table.tableData);
      };
      getPageList();
      // 解析图片
      function parseImage() {
        let imgSrc = [];
        let str = JSON.parse(table.tableData.images);
        for (const item of str) {
          imgSrc.push(table.imgUrl + item);
        }
        table.imgSrc = imgSrc[0];
      }

      return {
        table,
        parseImage,
      };
    },
  };
</script>