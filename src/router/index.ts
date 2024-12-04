import { createWebHistory, createRouter } from "vue-router";
import Login from "@/components/Login.vue";
import AdminIndex from "@/components/AdminIndex.vue";
import Register from "@/components/Register.vue";
import User from "@/pages/admin/user/User.vue";
import UserIndex from "@/components/UserIndex.vue";
import DownLog from "@/pages/admin/user/DownLog.vue";
import Home from "@/pages/user/Homes/Home.vue";
import Notices from "@/pages/admin/notices/Notices.vue";
import Notice from "@/pages/user/Notices/Notice.vue";
import Club from "@/pages/user/Clubs/Club.vue";
import ConfessionWall from "@/pages/user/ConfessionWalls/ConfessionWall.vue"
import IdentityLog from "@/pages/admin/user/IdentityLog.vue";
import CardDetail from "@/pages/user/ConfessionWalls/CardDetail.vue";
import Publish from "@/pages/user/Forms/Publish.vue";
import Confession from '@/pages/admin/confessionWall/Confession.vue'
export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/userIndex',
            component: UserIndex,
            redirect:'/userIndex/home',
            children:[
                {
                    path: 'home',
                    component:Home
                },
                {
                    path: 'notice',
                    component: Notice
                },
                {
                    path: 'club',
                    component: Club
                },
                {
                    path: 'confessionWall',
                    component: ConfessionWall
                },
                {
                    path: 'cardDetail/:id',
                    name:'CardDetail',
                    component: CardDetail
                },
                {
                    path:'post',
                    component: Publish
                }
            ]
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/adminIndex',
            component: AdminIndex,
            children: [
                {
                    path: 'users',
                    component: User
                },
                {
                    path: 'downLog',
                    component: DownLog
                },
                {
                    path: 'identityLog',
                    component: IdentityLog
                },
                {
                    path: 'confession',
                    component: Confession
                },
                {
                    path: 'notices',
                    component: Notices
                }
            ]
        },
        {
            path: '/register',
            component: Register
        }
    ]
})