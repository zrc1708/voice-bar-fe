import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  {path: '/login',component: Login},
  {path: '/home',component: Home},
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫  to表示将要访问的路径，from表示从哪个路径来
// next是一个函数，表示放行，next()放行，next('/login')强制跳转
router.beforeEach((to,from,next)=>{
  // NProgress.start()
  if(to.path==='/login') return next()
  const id = sessionStorage.getItem('id')
  if(!id) return next('/login')
  next()
})

export default router
