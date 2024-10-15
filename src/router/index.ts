import { createWebHistory, createRouter } from "vue-router";
import Login from "@/components/Login.vue";
import AdminIndex from "@/components/views/AdminIndex.vue";
import Register from "@/components/Register.vue";
import Home from "@/pages/admin/Home.vue";
import User from "@/pages/admin/User.vue";
import Order from "@/pages/admin/Order.vue";
import UserIndex from "@/components/views/UserIndex.vue";
export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path:'/',
            redirect:'/login'
        },
        {
            path:'/userIndex',
            component:UserIndex
        },
        {
            path:'/login',
            component: Login 
        },
        {
            path:'/adminIndex',
            component: AdminIndex,
            redirect:'/adminIndex/home',
            children: [{
                path:'orders',
                component: Order
            },
            {
                path:'users',
                component: User
            },
            {
                path:'home',
                component: Home
            }
            ]
            
        },
        {
            path:'/register',
            component: Register
        }
    ]
})