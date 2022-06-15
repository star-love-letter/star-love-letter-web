import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/assets/css/reset.css"
import "@/assets/css/global.css"
import 'windi.css'
import '@/assets/fontawesome/css/all.css'
import 'animate.css';
import dayjs from "dayjs";
// 引入中文包
import "dayjs/locale/zh-cn";
import { VueMasonryPlugin } from 'vue-masonry';
// 使用方法
// {{this.$dayjs(table.tableData.createTime).locale("zh-cn").format('YYYY-MM-DD HH:mm:ss')}}



const app = createApp(App)
app.config.globalProperties.$dayjs = dayjs


app.use(store).use(router).use(ElementPlus).use(VueMasonryPlugin).mount('#app')