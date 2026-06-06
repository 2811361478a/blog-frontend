<script setup>
import axios, { create } from 'axios';
import { onMounted, ref } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const direction=ref('desc')
const route=useRoute()
const message=ref('')
const error=ref('')
const loading=ref(false)
const posts=ref([])
const page=ref(0)
const size=ref(5)
const totalPages=ref(0)
const status=ref(null)
const keyword=ref('')
const sort=ref('createTime')
const totalPosts=ref(0)
let searchTimer=null
function debounceSerch(){
  clearTimeout(searchTimer)
  searchTimer=setTimeout(()=>{
    page.value=0
    loadPosts()
  },1000)
}
function changeDirection(d){
  direction.value=d
  page.value=0
  loadPosts()
}
function changeSize(s){
  size.value=s
  page.value=0
  loadPosts()
}
function changeSort(s){
  sort.value=s
  page.value=0
  loadPosts()
}
function showMessage(msg){
  message.value=msg
  setTimeout(()=>{
    message.value=''
  },2000)
}
const visiblePages=computed(()=>{
  const pages=[]
  let start=page.value-2
  let end=page.value+2
  if(start<0){
    start=0
    end=Math.min(4,totalPages.value-1)
  }
  if(end>=totalPages.value){
    end=totalPages.value-1
    start=Math.max(0,end-4)
  }
  for(let i=start;i<=end;i++){
    pages.push(i)
  }
  return pages
})
onMounted(()=>{
    loadPosts()
    if(route.query.message){
      showMessage(route.query.message)
    }
})
function search(){
  page.value=0
  status.value=null
  loadPosts()
}
async function loadPosts() {
  loading.value=true
  error.value=''
  try{
    let url=`https://blog-backend-production-ad2a.up.railway.app/Post?page=${page.value}&size=${size.value}&sort=${sort.value},${direction.value}`
    if(route.query.authorId){
      url=`https://blog-backend-production-ad2a.up.railway.app/Post/user/${route.query.authorId}?page=${page.value}&size=${size.value}&sort=${sort.value},${direction.value}`
    }else{
       if(keyword.value!==''){
        url+=`&keyword=${keyword.value}`
       }else if(status.value!==null){
        url+=`&status=${status.value}`
        } 
      }
      const res =await axios.get(url)
      posts.value=res.data.data.content
      totalPages.value=res.data.data.totalPages
      totalPosts.value=res.data.data.totalElements
     }catch(e){
    error.value='加载失败，请稍后重试'
  }
  finally{
    loading.value=false
  }
  
}
function formatDate(dateStr){
    if(!dateStr){
        return ''
    }
    return dateStr.substring(0,10)
}
function nextPage(){
  page.value++
  loadPosts()
  window.scrollTo({top:0,behavior:'smooth'})
}
function prevPage(){
  page.value--
  loadPosts()
  window.scrollTo({top:0,behavior:'smooth'})
}
function selectAll(){
  status.value=null
  page.value=0
  keyword.value=''
  loadPosts()
  showMessage('查看全部文章')
}
function selectPublished(){
  status.value=1
  keyword.value=''
  page.value=0
  loadPosts()
  showMessage('查看已发布文章')
}
function selectDraft(){
  status.value=0
  keyword.value=''
  page.value=0
  loadPosts()
  showMessage('查看草稿文章')
}
function goToPage(p){
  page.value=p
  loadPosts()
  window.scrollTo({top:0,behavior:'smooth'})
}

</script>
<template>
    <div>
      <button @click="selectAll">全部文章</button>
      <button @click="selectPublished">已发布</button>
      <button @click="selectDraft">草稿</button>
      <input v-model="keyword" @input="debounceSerch" placeholder="搜索文章..."/><button @click="search">搜索</button>
      <div class="sort-direction">
      排序:
      <button @click="changeSort('createTime')" :class="{active: sort==='createTime'}">
        按时间
      </button>
      <button @click="changeSort('viewCount')" :class="{active: sort==='viewCount'}">
        按阅读量
      </button>
      </div>
      <div class="sort-direction">
        方向:
        <button @click="changeDirection('asc')" :class="{active :direction==='asc'}">↑</button>
        <button @click="changeDirection('desc')" :class="{active :direction==='desc'}">↓</button>
      </div>
      
      <div v-if="message" class="message">
        {{ message }}
      </div>
        <div v-if="loading" class="loading">
          加载中...
        </div>
        <div v-else-if="error" class="error">
          {{ error }}
        </div>
        <div v-else>
          <div class="post-item"  v-for="post in posts" :key="post.id">
            <h3><router-link :to="'/post/'+post.id">{{ post.title }}</router-link> </h3>
            <p class="summary">{{ post.summary }}</p>
            <div class="meta">
            <span>作者：<router-link :to="'/user/'+post.authorId">{{ post.authorName }}</router-link></span>
            <span v-if="post.categoryName">分类:{{ post.categoryName }}</span>
            <span>阅读：{{ post.viewCount }}</span>
            <span>❤️{{ post.likeCount }}</span>
            <span v-if="post.status===1" class="status published">已发布</span>
            <span v-else class="status draft">草稿</span>
            <span>{{ formatDate(post.createTime) }}</span>
            </div>
        </div>
          <div v-if="posts.length===0 && !loading" class="empty">暂无文章</div>
        </div>
          <div class="pagination">
              <button @click="prevPage" :disabled="page===0">上一页</button>
              <button v-for="p in visiblePages" :key="p" @click="goToPage(p)"
               :class="{active: p===page}">{{ p+1 }}</button>
              <button @click="nextPage" :disabled="page>=totalPages-1">下一页</button>
              <div class="page-size">
                每页显示：
                <button @click="changeSize(5)" :class="{active: size===5}">5</button>
                <button @click="changeSize(10)" :class="{active: size===10}">10</button>
                <button @click="changeSize(20)" :class="{active: size===20}">20</button>
              </div>
              <div class="page-info">
                第{{ page+1 }}页/共{{ totalPages }}页
              </div>
              <div class="total-posts">
                共 {{ totalPosts }} 篇文章
              </div>
              
          </div>
        
          
    </div>
</template>
<style scoped>
.post-list {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
.post-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}
.post-item h3 a {
  color: #333;
  text-decoration: none;
}
.post-item h3 a:hover {
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
/* 普通页码按钮 — 浅色 */
.pagination button{
  background: none;
  border: 1px solid #ddd;
  color: #999;
  padding: 5px 10px;
  margin: 0 2px;
  cursor: pointer;
}
/* 当前页 — 黑色加粗 */
.pagination button.active {
  background: #333;
  color: white;
  border-color: #333;
}

/* 鼠标悬停效果 */
.pagination button:hover:not(.active) {
  color: #333;
  border-color: #333;
}
.loading{
  text-align: center;
  color: #999;
  padding: 40px;
}
.error{
  text-align: center;
  color: #f70606;
  padding: 40px;
}
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #67c23a;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 1000;
}
.page-info {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}
.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.published {
  background: #e1f3d8;
  color: #67c23a;
}
.draft {
  background: #faecd8;
  color: #e6a23c;
}
.page-size {
  margin: 10px 0;
  color: #999;
  font-size: 14px;
}
.page-size button {
  margin: 0 5px;
  padding: 2px 8px;
  border: 1px solid #ddd;
  background: none;
  cursor: pointer;
}
.page-size button.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}
.sort-direction {
  margin: 10px 0;
  color: #999;
  font-size: 14px;
}
.sort-direction button {
  margin: 0 5px;
  padding: 2px 8px;
  border: 1px solid #ddd;
  background: none;
  cursor: pointer;
}
.sort-direction button.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}
.total-posts {
  color: #999;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>