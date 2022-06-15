import { createRouter, createWebHistory } from 'vue-router'
import BarView from '../views/Bar.vue'
import TableList from '../views/TableList.vue'
import HomeView from '../views/HomeView.vue'
import ReleaseView from '../views/Release.vue'
// import RegisterView from '../views/RegisterView.vue'
// import UserView from '../views/UserView.vue'

const routes = [
  {
    path: '/',
    component: BarView,
    redirect: '/home',
    children:[
      {
        path: '/home',
        name: 'home',
        component: HomeView
      },
      {
        path: '/table',
        name: 'table',
        component: TableList
      },
      {
        path: '/release',
        name: 'release',
        component: ReleaseView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
