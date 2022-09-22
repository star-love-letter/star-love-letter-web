<template>
  <div
    class="
      nav
      px-30
      pt-20
      pb-10
      container
      m-auto
      flex
      items-center
      justify-between
      overflow-hidden
      relative
      <md:px-10 <md:pb-5 <md:pt-10
      <lg:px-10
    "
  >
    <img
      class="w-25 inline float-left <md:w-15"
      src="../assets/img/logo.png"
      alt="logo"
    />
    <div v-if="innerWidth >= 768" class="flex space-x-10 text-2xl">
      <div class="inline-block font-bold">
        <router-link to="/home" active-class="activeClass">
          <i class="fa-solid fa-house text-xl"></i>
          首页
        </router-link>
      </div>
      <div class="inline-block font-bold">
        <router-link to="/table" active-class="activeClass">
          <i class="fa-solid fa-table-list text-xl"></i>
          表白墙
        </router-link>
      </div>
      <div class="inline-block font-bold">
        <router-link to="/release" active-class="activeClass">
          <i class="fa-solid fa-heart-circle-plus text-xl"></i>
          我要表白
        </router-link>
      </div>
      <div class="inline-block font-bold">
        <router-link to="/help" active-class="activeClass">
          <i class="fa-solid fa-question text-xl"></i>
          帮助
        </router-link>
      </div>
    </div>
    <div class="right flex items-center">
      <!-- 登录头像 -->
      <div class="avatar_box mr-10">
        <!-- 未登录状态 -->
        <div
          class="
            bg-gray-200
            rounded-full
            w-13
            h-13
            flex
            justify-center
            items-center
            cursor-pointer
          "
          v-if="!login.isLogin"
          @click="login.showLoginView = true"
        >
          <span class="text-blue-400">登录</span>
        </div>
        <!-- 登录状态 -->
        <div v-else>
          <el-popover
            v-model:visible="login.showUserInfo"
            placement="bottom"
            :width="240"
          >
            <div relative>
              <ul>
                <li class="my-5">
                  <span class="text-orange-400">用户名：</span>
                  {{ login.loginInfo.name }}
                </li>
                <li class="my-5">
                  <span class="text-orange-400">用户邮箱：</span>
                  <div class="text ml-5">
                    {{ login.loginInfo.email }}
                  </div>
                </li>
                <li class="my-5">
                  <span class="text-orange-400">注册时间：</span>
                  <div class="text ml-5">
                    {{
                      this.$dayjs(login.loginInfo.createTime)
                        .locale('zh-cn')
                        .format('YYYY-MM-DD HH:mm:ss')
                    }}
                  </div>
                </li>
                <li class="my-5">
                  <span class="text-orange-400">上次登录的时间：</span>
                  <div class="text ml-5">
                    {{
                      this.$dayjs(login.loginInfo.lastTime)
                        .locale('zh-cn')
                        .format('YYYY-MM-DD HH:mm:ss')
                    }}
                  </div>
                </li>
              </ul>
              <i
                class="
                  fa-solid fa-xmark
                  absolute
                  top-5
                  right-5
                  text-xl
                  cursor-pointer
                "
                @click="login.showUserInfo = false"
              ></i>
              <el-button class="float-right" @click="logoutFn"
                >退出登录</el-button
              >
            </div>
            <template #reference>
              <el-avatar
                class="mr-3 w-13 h-13"
                @click="login.showUserInfo = !login.showUserInfo"
                :src="login.imgUrl + login.loginInfo.avatar"
              />
            </template>
          </el-popover>
        </div>
      </div>
      <i
        v-if="innerWidth < 768"
        @click="menuShow = !menuShow"
        :size="40"
        class="
          text-3xl
          fa-solid fa-bars
          leading-18
          block
          cursor-pointer
          z-20
          relative
          float-right
          <md:text-xl
        "
      ></i>
    </div>
  </div>
  <transition name="menu">
    <div
      class="bg-gray-100 bg-opacity-90 w-full h-full absolute top-0 z-10"
      v-show="menuShow"
    >
      <ul
        class="flex flex-col items-center justify-center h-full text-4xl"
        style="font-family: font1"
      >
        <li class="p-4" @click="menuShow = !menuShow">
          <router-link to="/home" active-class="activeClass">
            <i class="fa-solid fa-house text-xl"></i>
            首页
          </router-link>
        </li>
        <li class="p-4" @click="menuShow = !menuShow">
          <router-link to="/table" active-class="activeClass">
            <i class="fa-solid fa-table-list text-xl"></i>
            表白墙
          </router-link>
        </li>
        <li class="p-4" @click="menuShow = !menuShow">
          <router-link to="/release" active-class="activeClass">
            <i class="fa-solid fa-heart-circle-plus text-xl"></i>
            我要表白
          </router-link>
        </li>
        <li class="p-4" @click="menuShow = !menuShow">
          <router-link to="/help" active-class="activeClass">
            <i class="fa-solid fa-question text-xl"></i>
            帮助
          </router-link>
        </li>
      </ul>
    </div>
  </transition>
  <router-view></router-view>
  <loginDialog
    :isShow="login.showLoginView"
    @isSonShow="isSonShow"
  ></loginDialog>
</template>
<script>
  // 引入ref
  import { ref, reactive, onMounted, watch } from 'vue';
  import loginDialog from '../components/loginDialog.vue';
  import { apiUserInfo, apiLogout } from '@/apis/user.js';
  import { useStore } from 'vuex';
  export default {
    components: {
      loginDialog,
    },
    setup() {
      // 创建store实例
      const store = useStore();
      let innerWidth = ref(window.innerWidth);
      // 响应式menuShow
      let menuShow = ref(false);
      const login = reactive({
        showLoginView: false,
        // 是否登录
        isLogin: false,
        imgUrl: process.env.VUE_APP_BASEURL + '/api/file/image/',
        // 响应式登录表单
        loginFrom: {
          userStr: '',
          password: '',
        },
        loginInfo: {},
        // 是否显示用户信息
        showUserInfo: false,
      });
      const view = reactive({
        viewData: {}
      });
      // 获取登录信息
      function loginInfo(data) {
        login.isLogin = true;
        login.loginInfo = data;
      }
      // 退出登录
      function logoutFn() {
        apiLogout().then(res => {
          if (res.code === 200) {
            login.isLogin = false;
            login.loginInfo = {};
            store.commit('changeLogin', false);
            store.commit('getUserInfo', '');
            localStorage.setItem('loginInfo', '');
          }
        });
      }
      // 拿到子组件弹窗的值
      function isSonShow(val) {
        login.showLoginView = val;
      }
      // 监控store中的userInfo
      watch(
        () => store.state.userInfo,
        newVal => {
          if (newVal) {
            loginInfo(newVal);
          }
        }
      );
      // 监控store中的userInfo
      watch(
        () => login.isLogin,
        newVal => {
          if (newVal) {
            login.showLoginView = false;
          }
        }
      );
      onMounted(() => {
        // 获取用户信息---判断是否登录
        apiUserInfo().then(res => {
          if (res.code === 200) {
            store.commit('changeLogin', true);
            store.commit('getUserInfo', res.data);
            loginInfo(res.data);
          } else {
            // 将localStorage的loginInfo设置为空
            localStorage.setItem('loginInfo', '');
            store.commit('changeLogin', false);
          }
        });
      });
      return {
        innerWidth,
        menuShow,
        login,
        logoutFn,
        loginInfo,
        isSonShow,
        view
      };
    },
  };
</script>
<style>
  .activeClass {
    color: red;
  }
  .menu-enter-active {
    animation: menuShow 0.5s linear;
  }
  .menu-leave-active {
    animation: menuShow 0.5s linear reverse;
  }
  @keyframes menuShow {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
</style>