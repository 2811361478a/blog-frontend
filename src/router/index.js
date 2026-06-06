import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'


const routes=[
  {path:'/',component: ()=>import('@/views/PostList.vue')},
  {path:'/login',component:()=>import('@/views/Login.vue')},
  {path:'/register',component:()=>import('@/views/Register.vue')},
  {path:'/posts',component:()=>import('@/views/PostList.vue')},
  {path:'/post/create',component:()=>import('@/views/PostCreate.vue')},
  {path:'/post/edit/:id',component:()=>import('@/views/PostEdit.vue')},
  {path:'/post/:id',component:()=>import('@/views/PostDetail.vue')},
  {path:'/profile',component:()=>import('@/views/UserProfile.vue')},
  {path:'/user/:id',component:()=>import('@/views/UserPublicProfile.vue')},
  {path:'/categories',component:()=>import('@/views/CategoryManager.vue')},
  {path:'/messages',component:()=>import('@/views/MessageList.vue')},
  {path:'/message/:id',component:()=>import('@/views/MessageDetail.vue')}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})
router.beforeEach((to,from)=>{
  const userStore=useUserStore()
  if(userStore.user){return true}
  else if(to.path==='/login'||to.path==='/register'){
    return true
  }else{
    return '/login'
  }
})

export default router
