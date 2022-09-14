<template>
  <div class="h-full">
    <div class="w-100 flex justify-center flex-col items-center m-auto mt-60">
      <img src="../assets/img/error.png" alt="logo" class="w-60 mb-10"/>
      <p class="text-xl font-bold">{{closeMsg}}</p>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  let closeMsg = ref();
  closeMsg.value = route.params.message;
</script>