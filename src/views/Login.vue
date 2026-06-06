<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
const router=useRouter()
const userStore=useUserStore()
const inputpwd=ref('')
const inputname=ref('')
async function handleLogin() {
    const res=await userStore.login({username:inputname.value,pwd:inputpwd.value})
    if(res.code===200){
        router.push('/')
    }else{
        alert(res.message)
    }
}
function goToRegister(){
    router.push('/register')
}
</script>
<template>
    <p><input placeholder="请输入账号" v-model="inputname"/></p>
    <p><input placeholder="请输入密码" v-model="inputpwd" type="password"/></p>
    <p><button @click="handleLogin">登录</button>
    <button @click="goToRegister">去注册</button></p>
    
    
</template>