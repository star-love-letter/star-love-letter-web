import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import BarView from '../views/Bar.vue'
import TableList from '../views/TableList.vue'
import HomeView from '../views/HomeView.vue'
import ReleaseView from '../views/Release.vue'
import Help from '../views/Help.vue'
import TableDetails from '../views/TableDetails.vue'
import Register from '../views/Register.vue'


const routes = [{
    path: '/',
    component: BarView,
    redirect: '/home',
    children: [{
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
            path: '/Register',
            name: 'Register',
            component: Register
        },
        {
            path: '/detail',
            name: 'detail',
            component: TableDetails
        },
        {
            path: '/release',
            name: 'release',
            component: ReleaseView
        },
        {
            path: '/help',
            name: 'help',
            component: Help
        }
    ]
}]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router