import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login'
// import Home from '../components/Home'
// import Welcome from '../components/Welcome'
const Login = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Welcome')


// import Users from '../components/user/Users'
// import Rights from '../components/power/Rights'
// import Roles from '../components/power/Roles'
const Users = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/user/Users')
const Rights = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Rights')
const Roles = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Roles')


// import Cate from '../components/goods/Cate'
// import Params from '../components/goods/Params'
// import List from '../components/goods/List'
const Cate = () => import(/* webpackChunkName: "Cate-Params-List" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate-Params-List" */ '../components/goods/Params')
const List = () => import(/* webpackChunkName: "Cate-Params-List" */ '../components/goods/List')


// import Add from '../components/goods/Add'
// import Order from '../components/order/Order'
// import Report from '../components/report/Report'
const Add = () => import(/* webpackChunkName: "Add-Order-Report" */ '../components/goods/Add')
const Order = () => import(/* webpackChunkName: "Add-Order-Report" */ '../components/order/Order')
const Report = () => import(/* webpackChunkName: "Add-Order-Report" */ '../components/report/Report')


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫 
router.beforeEach((to, from, next) => {
  //to 将要访问的路径  
  //from 代表从哪个路径而来
  //next是一个函数，表示放行
  //next()放行 next('/login')强制跳转
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})


export default router
