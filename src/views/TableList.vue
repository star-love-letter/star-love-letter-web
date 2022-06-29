<template>
  <div class="container px-30 pb-10 m-auto <md:px-10 <md:pb-5 <md:pt-10">
    <el-input
      v-model="tableList.SearchListParam.keyword"
      placeholder="搜索"
      clearable
      size="large"
      @change="getSearchList"
    >
      <template #prefix>
        <i class="fa-solid fa-magnifying-glass"></i>
      </template>
    </el-input>
    <div
      v-masonry
      class="mt-5"
      v-if="
        tableList.searchTotal !== 0 ||
        (tableList.SearchListParam.keyword === '' &&
          tableList.searchTotal === 0)
      "
    >
      <Table
        v-for="item in tableList.tableList"
        :key="item.id"
        :tableData="item"
        :isDetail="false"
        @isLike="likeFunc"
        v-masonry-tile
      >
      </Table>
    </div>
    <!-- 全部数据的分页 -->
    <el-pagination
      v-if="!tableList.isSearchList"
      background
      layout="prev, pager, next"
      :total="tableList.tableTotal"
      class="flex justify-center"
      :page-size="tableList.pageListParam.pageSize"
      v-model:current-page="tableList.pageListParam.pageIndex"
    />
    <!-- 搜索数据的分页 -->
    <el-pagination
      v-else-if="tableList.isSearchList && tableList.searchTotal"
      background
      layout="prev, pager, next"
      :total="tableList.searchTotal"
      class="flex justify-center"
      :page-size="tableList.SearchListParam.pageSize"
      v-model:current-page="tableList.SearchListParam.pageIndex"
    />
    <div v-show="tableList.isSearchList && tableList.searchTotal === 0">
      <p class="text-center text-gray-400 text-xl mt-30">暂无数据</p>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, watch, ref } from "vue";
import {
  apiGetPageList,
  apiGetTableTotal,
  apiGetSearchList,
  apiGetSearchTableTotal,
} from "../apis/table.js";
import Table from "../components/Table";
import { useStore } from "vuex";

export default {
  components: {
    Table,
  },
  setup() {
    // 创建store实例
    const store = useStore();
    const tableList = reactive({
      tableList: [],
      tableTotal: 0,
      pageListParam: {
        pageIndex: 1,
        pageSize: 10,
      },
      SearchListParam: {
        keyword: "",
        pageIndex: 1,
        pageSize: 10,
        // 排序类型 true升序 false降序
        rankType: false,
      },
      // 是否为搜索列表
      isSearchList: false,
      total: 0,
      searchTotal: 0,
      loading: false,
      show: false,
    });
    // 获取列表数据
    watch(
      () => tableList.pageListParam.pageIndex,
      () => {
        getPageList();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    );
    // 获取搜索列表数据
    watch(
      () => tableList.SearchListParam.pageIndex,
      () => {
        getSearchList();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    );
    // 监控store中的userInfo
    watch(
      () => store.state.userInfo,
      (newVal) => {
        if (newVal) {
          getPageList();
        }
      },
      { immediate: true }
    );
    // 获取分页帖子列表
    function getPageList() {
      apiGetPageList(tableList.pageListParam).then((res) => {
        tableList.tableList = res.data;
      });
    }
    // 获取帖子总数
    function getTableTotal() {
      apiGetTableTotal().then((res) => {
        tableList.tableTotal = res.data;
      });
    }
    // 获取搜索帖子总数
    function getSearchTableTotal(keyword) {
      apiGetSearchTableTotal(keyword).then((res) => {
        tableList.searchTotal = res.data;
      });
    }
    // 获取搜索内容
    function getSearchList() {
      if (tableList.SearchListParam.keyword) {
        getSearchTableTotal(tableList.SearchListParam.keyword);
        apiGetSearchList(tableList.SearchListParam).then((res) => {
          tableList.isSearchList = true;
          tableList.tableList = res.data;
        });
      } else {
        getPageList();
        tableList.isSearchList = false;
      }
    }
    // 点赞
    function likeFunc() {
      getPageList();
    }
    onMounted(() => {
      getTableTotal();
    });
    return {
      tableList,
      getPageList,
      getSearchList,
      likeFunc,
    };
  },
};
</script>
<style lang='scss' scoped>
</style>
