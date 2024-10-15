import { createWebHistory, createRouter } from "vue-router";
import Login from "@/components/Login.vue";
import AdminIndex from "@/components/AdminIndex.vue";
import Register from "@/components/Register.vue";
import Home from "@/pages/Home.vue";
import User from "@/pages/User.vue";
import Order from "@/pages/Order.vue";
import UserIndex from "@/components/UserIndex.vue";
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