import { createWebHistory, createRouter } from "vue-router";
import Login from "@/components/Login.vue";
import Index from "@/components/Index.vue";
import Register from "@/components/Register.vue";
import Home from "@/pages/Home.vue";
import User from "@/pages/User.vue";
import Order from "@/pages/Order.vue";
export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path:'/',
            redirect:'/login'
        },
        {
            path:'/login',
            component: Login 
        },
        {
            path:'/index',
            component: Index,
            redirect:'/index/home',
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