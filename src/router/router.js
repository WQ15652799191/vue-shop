import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
const Users = () => import(/* webpackChunkName:"user" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName:"power" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName:"power" */ '../components/power/Roles.vue')
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
const Cate = () => import(/* webpackChunkName:"goods" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params.vue')
// import List from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
const List = () => import(/* webpackChunkName:"goods" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName:"goods" */ '../components/goods/Add.vue')
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'
const Order = () => import(/* webpackChunkName:"order" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName:"report" */ '../components/report/Report.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
// from表示从哪里来, to表示到哪里去，next是一个函数，表示放行，next('/login')表示强制跳转到路径
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  } else {
    return next()
  }
})

export default router
