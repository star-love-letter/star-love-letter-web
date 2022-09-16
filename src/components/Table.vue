<template>
  <div
    :class="
      isDetail
        ? `${table.style} + w-5/7 mx-auto`
        : `${table.style} + w-120 mx-5 mb-5 <xl:mx-3`
    "
    style="background-color: #ffebc0"
  >
    <header
      class="
        grid grid-cols-24
        border-b-1 border-gray-400 border-dotted
        pb-2
        text-center
      "
    >
      <div class="col-start-6 col-span-12 flex items-center justify-center">
        <span>{{ table.tableData.sender }}</span>
        <img class="w-6 mx-4 my-2" src="../assets/img/heart2.png" alt="" />
        <span>{{ table.tableData.recipient }}</span>
      </div>
      <div class="col-span-6 flex items-end justify-end">
        <span
          class="text-xs mx-5 text-red-700 font-bold"
          v-if="table.tableData.state === 1"
          >已封禁</span
        >
        <span class="text-xs mx-5 text-blue-500" v-else-if="isMine"
          >我的帖子</span
        >
        <span @click="onReport" class="text-xs mx-5" v-else> 举报 </span>
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
          <span class="font-bold"> [匿名] </span>
        </div>
        <div
          v-else-if="table.tableData.userPublic != null"
          class="block my-2 text-sm"
        >
          <span class="block my-2">
            {{ table.tableData.userPublic.name }}
          </span>
        </div>
        <div class="block text-xs">
          {{
            this.$dayjs(table.tableData.createTime)
              .locale('zh-cn')
              .format('YYYY-MM-DD HH:mm:ss')
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
          :class="
            isDetail
              ? `w-1/3 mr-1 h-50`
              : `w-3/10 mr-1 h-28 <xl:h-25 <lg:h-32 <sm:h-22`
          "
          :src="item"
          :preview-src-list="isDetail ? table.imgSrc : []"
          :initial-index="index"
          fit="cover"
        >
          <template #placeholder>
            <div
              class="bg-gray-200 text-gray-400 flex items-center justify-center"
              :class="
                isDetail
                  ? `w-full mr-1 h-50`
                  : `w-full mr-1 h-28 text-xs <xl:h-25 <lg:h-32 <sm:h-22`
              "
            >
              Loading...
            </div>
          </template>
          <template #error>
            <div
              class="bg-gray-200 text-gray-400 flex items-center justify-center"
              :class="
                isDetail
                  ? `w-full mr-1 h-50`
                  : `w-full mr-1 h-28 <xl:h-25 <lg:h-32 <sm:h-22`
              "
            >
              <i class="fa-solid fa-image"></i>
            </div>
          </template>
        </el-image>
      </div>
    </main>
    <footer class="flex justify-around mt-12">
      <div v-show="table.isLike" @click="cancelLike" class="text-yellow-600">
        <i class="fa-solid fa-thumbs-up"></i>
        {{ table.tableData.supportCount }}
      </div>
      <div v-show="!table.isLike" @click="like" class="hover:text-yellow-600">
        <i class="fa-regular fa-thumbs-up"></i>
        {{ table.tableData.supportCount }}
      </div>
      <div
        @click="gotoDetail"
        :class="isDetail ? 'text-yellow-600' : 'hover:text-yellow-600'"
      >
        <i class="fa-solid fa-comment"></i>
        {{ table.tableData.commentCount }}
      </div>
      <div><i class="fa-solid fa-share-from-square"></i></div>
    </footer>

    <el-dialog
      v-model="dialogReportShow"
      title="用户举报"
      top="7vh"
      center
      width="40%"
      :fullscreen="innerWidth < 768"
    >
      <el-form :model="formReport" label-width="100px">
        <el-form-item label="帖子id">
          <el-input disabled v-model="formReport.tableId"></el-input>
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            type="textarea"
            :rows="5"
            v-model="formReport.content"
          ></el-input>
        </el-form-item>

        <el-form-item label="举报类型">
          <el-select v-model="formReport.type" placeholder="帖子状态">
            <el-option label="违法违禁" :value="1"></el-option>
            <el-option label="色情低俗" :value="2"></el-option>
            <el-option label="垃圾广告" :value="3"></el-option>
            <el-option label="赌博诈骗" :value="4"></el-option>
            <el-option label="人身攻击" :value="5"></el-option>
            <el-option label="传播谣言" :value="6"></el-option>
            <el-option label="其他" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveDialogReport">提 交</el-button>
          <el-button @click="closeDialogReport">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  // 静态头像
  import avatarAnonymous from '../assets/img/avatar-anonymous1.jpg';
  import { onMounted, reactive, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { apiLike, apiCancelLike, apiReport } from '../apis/table';
  import { useStore } from 'vuex';
  import { ElNotification } from 'element-plus';
  export default {
    props: {
      tableData: Object,
      isDetail: Boolean,
    },
    emits: ['isLike'],
    setup(props, context) {
      // 创建store实例
      const store = useStore();

      let innerWidth = ref(window.innerWidth);
      const formReport = reactive({
        tableId: props.tableData.id,
        type: 0,
        content: '',
      });
      // 是否为本人发布的帖子
      let isMine = ref(false);
      let dialogReportShow = ref(false);
      const table = reactive({
        tableData: props.tableData,
        isLike: props.tableData.support,
        style:
          'p-4 text-gray-600 <xl:w-90  <lg:w-120 <lg:mx-5 <md:w-full box-border<md:mb-5 <md:mx-0 <md:p-2',
        imgSrc: [],
        imgUrl: process.env.VUE_APP_BASEURL + '/api/file/image/',
        // 是否有图片
        hasImg: false,
      });
      onMounted(() => {
        if (localStorage.getItem('loginInfo') !== '') {
          // 获取localStorage中的loginInfo
          const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
          // 如果有table.tableData.userPublic不等于null
          if (table.tableData.userPublic !== null) {
            if (loginInfo.id === table.tableData.userPublic.id)
              isMine.value = true;
            else isMine.value = false;
          }
        }
      });
      // 监控store中的userInfo
      watch(
        () => store.state.userInfo,
        newVal => {
          // 获取localStorage中的loginInfo
          const loginInfo = store.state.userInfo;
          if (table.tableData.userPublic !== null) {
            if (loginInfo.id === table.tableData.userPublic.id)
              isMine.value = true;
            else isMine.value = false;
          }
        }
      );
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
      const router = useRouter();
      // 跳转到帖子详情页
      function gotoDetail() {
        router.push({
          path: '/detail',
          query: {
            id: table.tableData.id,
          },
        });
      }
      //举报帖子
      function onReport() {
        console.log(formReport);
        dialogReportShow.value = true;
      }

      function closeDialogReport() {
        dialogReportShow.value = false;
      }

      function saveDialogReport() {
        apiReport(formReport.tableId, formReport.type, formReport.content).then(
          res => {
            if (res.code === 200) {
              ElNotification.success('举报成功');
              closeDialogReport();
            } else {
              $warningPopup(res);
            }
          }
        );
      }
      // 点赞
      function like() {
        apiLike(table.tableData.id).then(res => {
          if (res.code === 200) {
            context.emit('isLike', res);
            table.isLike = true;
            table.tableData.supportCount++;
          } else {
            $warningPopup(res);
          }
        });
      }
      // 取消点赞
      function cancelLike() {
        apiCancelLike(table.tableData.id).then(res => {
          if (res.code === 200) {
            context.emit('isLike', res);
            table.isLike = false;
            table.tableData.supportCount--;
          } else {
            $warningPopup(res);
          }
        });
      }
      return {
        innerWidth,
        table,
        avatarAnonymous,
        isMine,
        gotoDetail,
        like,
        cancelLike,
        onReport,
        dialogReportShow,
        closeDialogReport,
        saveDialogReport,
        formReport,
      };
    },
  };
</script>
<style lang="">
</style>