<script setup>
import axios from 'axios';
import {  onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
const userStore=useUserStore()
const router=useRouter()
const categories=ref([])
onMounted(async()=>{
    const res=await axios.get('http://localhost:8080/Category')
    categories.value=res.data.data
})
const post=ref({
    title:'',
    summary:'',
    content:'',
    status:0,
    authorId:userStore.user.id,
    categoryId:null
}) 

const submit=async()=>{
    await axios.post('http://localhost:8080/Post',post.value)
    router.push('/posts?message=发布成功')
}
</script>
<template>
    <div class="post-create">
        <h2>发布文章</h2>
        <form @submit.prevent="submit">
            <div class="form-item">
                <label>标题</label>
                <input v-model="post.title" placeholder="请输入标题">
            </div>
            <div class="form-item">
                <label>摘要</label>
                <input v-model="post.summary" placeholder="请输入摘要">
            </div>
            <div class="form-item">
                <label>内容</label>
                <textarea v-model="post.content" placeholder="请输入内容"></textarea>
            </div>
            <div class="form-item">
                <label>分类</label>
                <select v-model="post.categoryId">
                    <option :value="null">未分类</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">
                        {{ c.name }}
                    </option>
                </select>
            </div>
            <div class="form-item">
                <label>状态</label>
                <select v-model="post.status">
                    <option :value="0">草稿</option>
                    <option :value="1">发布</option>
                </select>
            </div>
            <button type="submit">提交</button>
        </form>
        
    </div>
</template>
<style scoped>
.post-create{
    max-width: 800px;
    margin: 20px auto;
    padding: 0 20px;
}
.post-create h2{
    margin-bottom:20px;
}
.post-create .form-item{
    margin-bottom: 15px;
}
.post-create label{
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}
.post-create  input{
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}
.post-create  select{
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}
.post-create textarea{
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}
textarea{
    resize: vertical;
}
.post-create button{
    margin-top: 15px;
    padding: 10px 30px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer
}
button:hover {
    background: #66b1ff;
}
</style>