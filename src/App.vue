<script setup>
import { useUserStore } from './stores/userStore';
import { useRouter } from 'vue-router';
const userStore=useUserStore()
const router=useRouter()
function handleLoginout(){
    userStore.logout()
    router.push('/login')
}

</script>
<template>
    <nav class="nav">
    <router-link to="/posts" class="brand">JBlog</router-link>
    <router-link to="/posts">文章列表</router-link>
    <router-link to="/post/create">发布文章</router-link>
    <template v-if="!userStore.user">
    <router-link to="/login" v-if="!userStore.user">登录</router-link>
    </template>
    <template v-else>
    <router-link to="/profile" >个人中心</router-link>
    <router-link to="/messages">消息</router-link>
    <span >
        {{ userStore.user.username}}
        <button @click="handleLoginout">退出</button>
    </span>
    </template>
   
    
    </nav>
    
    <router-view></router-view>
</template>
<style scoped>

.nav{
    background-color: #333;
    padding: 15px;
    display: flex;
    gap: 20px;
}
.nav a{
    color: white;
    text-decoration: none;
}
.brand{
    font-size: 20px;
    font-weight: bold;
    margin-right: 10px;
}


</style>