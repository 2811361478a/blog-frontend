<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRoute, useRouter} from 'vue-router';
const showDeleteCommentDialog=ref(false)
const deleteCommentId=ref(null)
const comments=ref([])
const commentCount=ref(0)
const newComment=ref('')
const likeCount=ref(0)
const isLiked=ref(false)
const userStore=useUserStore()
const router=useRouter()
const route=useRoute()
const post=ref(null)
const showDeleteDialog=ref(false)
onMounted(async()=>{
   const res = await axios.get(`http://localhost:8080/Post/${route.params.id}`)
   post.value=res.data.data
   const likeCountRes= await axios.get(`http://localhost:8080/Like/${post.value.id}/count`)
   const isLikedRes=await axios.get(`http://localhost:8080/Like/${post.value.id}/check?userId=${userStore.user.id}`)
   likeCount.value=likeCountRes.data.data
   isLiked.value=isLikedRes.data.data
   const commentsRes=await axios.get(`http://localhost:8080/Comment/${post.value.id}`)
   const commentCountRes=await axios.get(`http://localhost:8080/Comment/${post.value.id}/count`)
   comments.value=commentsRes.data.data
   commentCount.value=commentCountRes.data.data
})
function confirmDeleteComment(commentId){
    deleteCommentId.value=commentId
    showDeleteCommentDialog.value=true
}
async function deleteComment() {
    showDeleteCommentDialog.value=false
    await axios.delete(`http://localhost:8080/Comment/${deleteCommentId.value}`)
    const commentsRes=await axios.get(`http://localhost:8080/Comment/${post.value.id}`)
    comments.value=commentsRes.data.data
    commentCount.value--
}
async function submitComment() {
    if(!newComment.value.trim()) return

    await axios.post(`http://localhost:8080/Comment/${post.value.id}?userId=${userStore.user.id}`,
    newComment.value,{headers:{'Content-Type':'text/plain'}}
    )
    newComment.value=''
    const commentsRes=await axios.get(`http://localhost:8080/Comment/${post.value.id}`)
    comments.value=commentsRes.data.data
    commentCount.value++
}
async function toggleLike(){
   const res=await axios.post(`http://localhost:8080/Like/${post.value.id}?userId=${userStore.user.id}`)
   if(res.data.data){
   isLiked.value=true
   likeCount.value++
   }else{
    isLiked.value=false
    likeCount.value--
   }
   
}
async function confirmDelete(){
    showDeleteDialog.value=false
    await axios.delete(`http://localhost:8080/Post/${route.params.id}?userId=${userStore.user.id}`)
    router.push('/posts?message=删除成功')
   }
function back(){
    router.push('/posts')
}
function formatDate(dateStr) {
    if (!dateStr) return ''
    return dateStr.substring(0, 16).replace('T',' ')
}
</script>
<template>
    <div v-if="post" class="post-detail">
        <h1>{{ post.title }}</h1>
        <p>{{ post.content }}</p>
        <div class="meta">
            <span >作者：<router-link :to="'/user/'+post.authorId">{{ post.authorName }}</router-link> </span>
            <span>时间：{{ formatDate(post.createTime) }}</span>
            <span v-if="post.categoryName">分类：{{ post.categoryName }}</span>
        </div>
        <button @click="toggleLike">{{ isLiked ?'❤️ 已点赞' : '🤍 点赞'}} {{ likeCount }}</button>
        <button v-if="post.authorId===userStore.user.id" @click="router.push(`/post/edit/${post.id}`)">编辑</button>
        <button v-if="post.authorId===userStore.user.id" @click="showDeleteDialog=true">删除</button>
        <button @click="back">返回</button>
    </div>
    <div class="comments">
        <h3>评论({{ commentCount }})</h3>
        <div class="comment-form">
            <textarea v-model="newComment" placeholder="写下你的评论..."></textarea>
            <button @click="submitComment">发表评论</button>
        </div>
        <div class='comment-item' v-for="comment in comments" :key="comment.id">
            <div class="comment-meta">
                <span>{{ comment.username }}</span>
                <span>{{ formatDate(comment.createTime) }}</span>
                <!-- 只有评论作者才能看到删除按钮 -->
                 <button v-if="comment.userId===userStore.user.id" 
                 @click="confirmDeleteComment(comment.id)" class="delete-btn">删除</button>
            </div>
            <p>{{ comment.content }}</p>
        </div>
        
    </div>
      <!-- 确认删除评论弹窗 -->
   <div class="dialog-overlay" v-if="showDeleteCommentDialog">
     <div class="dialog">
       <p>确定要删除这条评论吗？</p>
       <div class="dialog-buttons">
         <button @click="deleteComment">确定</button>
         <button @click="showDeleteCommentDialog=false">取消</button>
       </div>
     </div>
    </div>

    <div class="dialog-overlay" v-if="showDeleteDialog">
        <div class="dialog">
            <p>确定要删除这篇文章吗</p>
            <div class="dialog-buttons">
              <button @click="confirmDelete">确定</button>   
              <button @click="showDeleteDialog=false">取消</button>   
            </div>
        </div>
    </div>
</template> 
<style scoped>
.post-detail{
    max-width: 800px;
    margin: 20px auto;
    padding: 0 20px;
}
.post-detail h1{
    font-size: 28px;
    padding-bottom: 15px;
    border-bottom: 2px solid #eee;
}
.post-detail p{
    line-height: 1.8;
    margin: 20px;
    white-space: pre-wrap;
    font-size: 16px;
    color: #333;
}
.post-detail .meta{
    color: #999;
    font-size: 14px;
    margin-top:20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}
.post-detail span{
    margin-right: 20px;
}
.post-detail button{
    margin-top: 20px;
    padding: 8px 20px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
button:hover {
  background: #66b1ff;
}
.dialog-overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.dialog {
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 300px;
    text-align: center;
}
.dialog-buttons {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    gap: 10px;
}
.dialog-buttons button:first-child {
    background: #f56c6c;
}
/* 评论区容器 */
.comments {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #eee;
}

.comments h3 {
  margin-bottom: 20px;
  color: #333;
}

/* 评论表单 */
.comment-form {
  margin-bottom: 20px;
}

.comment-form textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;  /* 只能垂直拉伸 */
  font-size: 14px;
}

.comment-form button {
  margin-top: 10px;
}

/* 评论项 */
.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

/* 评论元信息（用户、时间） */
.comment-meta {
  color: #999;
  font-size: 13px;
  margin-bottom: 8px;
}

.comment-meta span {
  margin-right: 15px;
}

/* 评论内容 */
.comment-item p {
  margin: 0;
  color: #333;
  line-height: 1.6;
}
.delete-btn {
  background: #f56c6c;
  color: white;
  border: none;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
}
</style>