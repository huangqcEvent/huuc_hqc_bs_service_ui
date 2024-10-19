import { createWebHistory, createRouter } from "vue-router";
import Login from "@/components/Login.vue";
import AdminIndex from "@/components/views/AdminIndex.vue";
import Register from "@/components/Register.vue";
import User from "@/pages/admin/User.vue";
import UserIndex from "@/components/views/UserIndex.vue";
import DownLog from "@/pages/admin/DownLog.vue";
import Home from "@/pages/user/Home.vue";
import Notice from "@/pages/user/Notice.vue";
import Club from "@/pages/user/Club.vue";
import ConfessionWall from "@/pages/user/ConfessionWall.vue";
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
                }
            ]
        },
        {
            path: '/register',
            component: Register
        }
    ]
})