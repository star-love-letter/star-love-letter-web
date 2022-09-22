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
      <HomePhoto :isFirstImg="true"></HomePhoto>
    </div>
    <HomePhoto></HomePhoto>
  </div>
  <div
    class="bg-dark-100 w-full p-5 text-center text-white text-sm flex flex-col"
  >
    <a href="https://beian.miit.gov.cn" target="_blank" class="text-md">{{view.viewData.footer}}</a>
  </div>
</template>

<script setup>
  import HomePhoto from '../components/ShowPhoto.vue';
  import { reactive, onMounted } from 'vue';
  import { useStore } from 'vuex';
  const store = useStore();

  const view = reactive({
    viewData: {},
  });
  onMounted(() => {
    store.dispatch('getView');
    view.viewData = store.state.viewData;
  });
</script>