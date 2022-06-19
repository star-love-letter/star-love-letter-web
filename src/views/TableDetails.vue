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
      class="px-4 py-8 w-5/7 mx-auto h-auto text-gray-600"
      style="background-color: #ffebc0"
    >
      <Comment
        v-for="item in comment.commentData"
        :key="item.id"
        :commentData="item"
      >
      </Comment>
      <div class="text-center font-bold" v-if="comment.commentData.length === 0">暂无评论</div>
      <div>
        
      </div>
    </div>
  </div>
</template>
<script>
import { reactive } from "vue";
import { useRoute } from "vue-router";
import { apiGetTable } from "../apis/table.js";
import { apiGetCommentList } from "../apis/comment.js";
import Table from "../components/Table";
import Comment from "../components/Comment.vue";
export default {
  components: {
    Table,
    Comment,
  },
  setup() {
    const route = useRoute();
    const tableDetail = reactive({
      tableData: [],
    });
    const comment = reactive({
      commentData: [],
      commentParam: {
        pageIndex: 1,
        pageSize: 10,
        tableId: route.query.id,
      },
    });
    // 获取详情数据
    apiGetTable(route.query.id).then((res) => {
      tableDetail.tableData.push(res.data);
    });
    // 获取评论数据
    apiGetCommentList(comment.commentParam).then((res) => {
      comment.commentData = res.data;
    });
    return {
      tableDetail,
      comment,
    };
  },
};
</script>