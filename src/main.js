import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
// import "@/assets/css/reset.css"
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
import { ElNotification } from "element-plus";


// 警告弹窗
function warningPopup(data) {
    ElNotification({
        type: "warning",
        title: 'Warning',
        message: data.message,
    })
}

const app = createApp(App)

// 全局注册
app.config.globalProperties.$dayjs = dayjs
app.config.globalProperties.$imgUrl = process.env.VUE_APP_BASEURL + "/api/file/image/"
window.$warningPopup = warningPopup

app.use(store).use(router).use(ElementPlus).use(VueMasonryPlugin).mount('#app')