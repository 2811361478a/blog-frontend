<script setup>
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const userStore=useUserStore()
const currentStatus=ref(null)
const route=useRoute()
const userInfo=ref({
    username:'',
    createTime:''
})
const posts=ref([])
const page=ref(0)
const size=ref(5)
const totalPages=ref(0)
const isMyProfile=computed(()=>{
    return userStore.user&&userStore.user.id==route.params.id
})
function filterStatus(status){
    currentStatus.value=status
    page.value=0
    loadPosts()
}
onMounted(async()=>{
    const userRes=await axios.get(`http://localhost:8080/Users/${route.params.id}`)
    userInfo.value=userRes.data.data
    loadPosts()
})
async function loadPosts() {
    let url=`http://localhost:8080/Post/user/${route.params.id}?page=${page.value}&size=${size.value}`
    if(userStore.user){
        url+=`&currentUserId=${userStore.user.id}`
    }
    if(currentStatus.value!=null){
        url+=`&status=${currentStatus.value}`
    }
    const res=await axios.get(url)
    posts.value=res.data.data.content
    totalPages.value=res.data.data.totalPages
}
function formatDate(dateStr){
    if(!dateStr) return ''
    return dateStr.substring(0,10)
}
function nextPage(){
    page.value++
    loadPosts()
}
function prevPage(){
    page.value--
    loadPosts()
}
</script>
<template>
    <div class="user-profile">
        <h2>{{ userInfo.username }}的主页</h2>
        <router-link :to="'/message/'+route.params.id" class="send-message">发私信</router-link>
        <div class="user-info">
            <p><strong>用户名：</strong>{{ userInfo.username }}</p>
            <p><strong>注册时间：</strong>{{ userInfo.createTime?.substring(0,10) }}</p>
        </div>
        <h3>发布的文章</h3>
        <div class="status-filter">
            <button @click="filterStatus(null)" :class="{active: currentStatus===null}">全部</button>
            <button @click="filterStatus(1)" :class="{active: currentStatus===1}">已发布</button>
            <button v-if="isMyProfile" @click="filterStatus(0)" :class="{active: currentStatus===0}">草稿</button>
        </div>
        
        <div v-if="posts.length===0" class="empty">暂无文章</div>
        <div v-else>
            <div class="post-item" v-for="post in posts" :key="post.id">
                <h4><router-link :to="'/post/'+post.id">{{ post.title }}</router-link></h4>
                <p class="summary">{{ post.summary }}</p>
                <div class="meta">
                    <span>阅读:{{ post.viewCount }}</span>
                    <span>❤️{{ post.likeCount }}</span>
                    <span>{{ formatDate(post.createTime) }}</span>
                </div>
            </div>
            <div class="pagination">
                <button @click="prevPage" :disabled="page===0">上一页</button>
                <span>第{{ page+1 }}页/共{{ totalPages }}页</span>
                <button @click="nextPage" :disabled="page>=totalPages-1">下一页</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.send-message {
    display: inline-block;
    padding: 8px 20px;
    background: #67c23a;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin-left: 10px;
}

.send-message:hover {
    background: #85ce61;
}
.user-profile {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.user-info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.post-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}

.post-item h4 a {
  color: #333;
  text-decoration: none;
}

.post-item h4 a:hover {
  color: #409eff;
}

.summary {
  color: #666;
  margin: 8px 0;
}

.meta {
  color: #999;
  font-size: 14px;
}

.meta span {
  margin-right: 15px;
}

.empty {
  text-align: center;
  color: #999;
  padding: 40px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination button {
  padding: 5px 15px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.status-filter {
  margin: 15px 0;
}

.status-filter button {
  margin-right: 10px;
  padding: 5px 15px;
  border: 1px solid #ddd;
  background: none;
  cursor: pointer;
}

.status-filter button.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}
</style>