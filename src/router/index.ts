import { createWebHistory, createRouter } from "vue-router";
import Login from "@/components/Login.vue";
import AdminIndex from "@/components/views/AdminIndex.vue";
import Register from "@/components/Register.vue";
import User from "@/pages/admin/User.vue";
import UserIndex from "@/components/views/UserIndex.vue";
import DownLog from "@/pages/admin/DownLog.vue";
export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/userIndex',
            component: UserIndex
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