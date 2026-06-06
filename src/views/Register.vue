<script setup>
import { register as registerApi } from '@/api';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router=useRouter()
const inputname=ref('')
const inputpwd=ref('')
async function register(){
    const res=await registerApi({username:inputname.value,pwd:inputpwd.value})
    if(res.data.code===200){
        router.push('/login')
    }else alert(res.data.message)
}
</script>
<template>
    <p>
    <input placeholder="请输入用户名" v-model="inputname"/>
    <input placeholder="请输入密码" v-model="inputpwd" type="password"/>
    <button @click="register">注册</button>
    </p>
    
</template>