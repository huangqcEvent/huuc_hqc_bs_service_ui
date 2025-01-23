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
import Club1 from "@/pages/admin/club/Club.vue";
import ConfessionWall from "@/pages/user/ConfessionWalls/ConfessionWall.vue"
import IdentityLog from "@/pages/admin/user/IdentityLog.vue";
import CardDetail from "@/pages/user/ConfessionWalls/CardDetail.vue";
import Publish from "@/pages/user/Forms/Publish.vue";
import Confession from '@/pages/admin/confessionWall/Confession.vue'
import MyIndex from "@/pages/user/Index/MyIndex.vue";
import LostItemDetail from "@/pages/user/Notices/LostItemDetail.vue";
import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import PostAudit from "@/pages/admin/audit/PostAudit.vue";
import Detail from "@/pages/admin/detail/Detail.vue";
import ClubDetail from "@/pages/user/Clubs/ClubDetail.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/userIndex',
            component: UserIndex,
            redirect: '/userIndex/home',
            children: [
                {
                    path: 'home',
                    component: Home
                },
                {
                    path: 'notice',
                    component: Notice
                },
                {
                    path: 'lostItemDetail/:id',
                    component: LostItemDetail
                },
                {
                    path: 'clubDetail/:id',
                    name: 'ClubDetail',
                    component: ClubDetail
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
                    name: 'CardDetail',
                    component: CardDetail
                },
                {
                    path: 'post',
                    component: Publish
                },
                {
                    path: 'myIndex',
                    component: MyIndex
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
            redirect: '/adminIndex/audit',
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
                },
                {
                    path: 'audit',
                    component: PostAudit
                },
                {
                    path: 'club',
                    component: Club1
                },
                {
                    path: 'detail/:userId/:postId/:postType/:id?/:status',
                    component: Detail
                }
            ]
        },
        {
            path: '/register',
            component: Register
        }
    ]
})
router.beforeEach((to, from, next) => {
    // 排除登录和注册页面
    if (to.path === '/login' || to.path === '/register') {
        next();
        return;
    }

    // 用户侧
    if (to.path.startsWith('/userIndex')) {
        if (localStorage.getItem('userToken') != null) {
            next();
        } else {
            ElMessageBox.alert('为了您更好的浏览体验，请先登录！', '提示', {
                confirmButtonText: 'OK',
                type: 'warning',
                callback: (action: Action) => {
                    next('/login');
                },
            })
        }
    }
    // 管理侧
    else if (to.path.startsWith('/adminIndex')) {
        if (localStorage.getItem('adminToken') != null) {
            next();
        } else {
            ElMessageBox.alert('为了您更好的浏览体验，请先登录！', '提示', {
                confirmButtonText: 'OK',
                type: 'warning',
                callback: (action: Action) => {
                    next('/login');
                },
            })
        }
    }
    // 其他页面（如果需要额外处理）
    else {
        next();
    }
});

// 全局后置守卫：在路由导航完成后执行（可选）
router.afterEach((to, from) => {
    // 在这里可以做一些数据统计、分析、页面标题设置等操作
});
export default router;