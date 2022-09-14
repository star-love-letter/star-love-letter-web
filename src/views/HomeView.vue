<template>
  <div class="home w-full container px-30 m-auto <lg:px-10 <md:px-10">
    <div class="flex justify-between flex-wrap <md:block">
      <div class="w-7/15 h-100 <md:w-full <xl:h-auto">
        <div class="pt-30 font-bold <md:pt-10">
          <h1 class="text-6xl text-red-500 pb-4 <lg:text-5xl <md:text-4xl">
            表白
          </h1>
          <h3 class="text-3xl <lg:text-2xl <md:text-xl">让我们从这里开始</h3>
        </div>
        <p class="text-xl pt-6 <md:text-base">
          在这里，你可以表白你的爱情，也可以表白你的爱人。
          我们都有喜欢别人的权利，一款可匿名的表白墙，让你羞涩的内心得以表达。
        </p>
      </div>
      <HomePhoto :isFirstImg="true" :tableData="allListData"></HomePhoto>
    </div>
    <HomePhoto :tableData="allListData"></HomePhoto>
  </div>
  <div
    class="bg-dark-100 h-15 w-full leading-15 text-center text-white text-sm"
  >
    <a href="https://beian.miit.gov.cn" target="_blank"> 鲁ICP备19013208号</a>
  </div>
</template>

<script setup>
  // 引入组件
  import HomePhoto from '../components/ShowPhoto.vue';
  import { apiGetPageList } from '../apis/table.js';
  const PageListParam = {
    pageIndex: 1,
    pageSize: 10,
    rankName: 'support_count',
  };
  let allListData = [];
  // 获取页面数据
  const getPageList = async () => {
    // 根据点赞数获取数据
    await apiGetPageList(PageListParam).then(res => {
      // 遍历数据 如果有图片就添加到数组
      for (const item of res.data) {
        if (item.images !== null && item.images !== undefined) {
          allListData.push(item);
          if (allListData.length === 2) {
            return;
          }
        }
      }
      // 判断有图片的列表
      // 如果有图片的数组列表小于2的话就将页数增加1并递归调用这个函数
      if (allListData.length < 2) {
        PageListParam.pageIndex++;
        getPageList();
      }
    });
  };
  getPageList();
</script>