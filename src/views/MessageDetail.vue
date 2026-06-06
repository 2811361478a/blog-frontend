<script setup>
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

let timer=null
const userStore=useUserStore()
const route=useRoute()
const messages=ref([])
const newMessage=ref('')
const chatContainer=ref(null)
const otherUser=ref([])
onMounted(async()=>{
    const userRes = await axios.get(`https://blog-backend-production-ad2a.up.railway.app/Users/${route.params.id}`)
    otherUser.value=userRes.data.data
    loadMessages()
    timer=setInterval(()=>{
        loadMessages()
    },3000)
})
onUnmounted(()=>{
    if(timer){
        clearInterval(timer)
    }
})

async function loadMessages() {
    const res = await axios.get(`https://blog-backend-production-ad2a.up.railway.app/Message/conversation/${userStore.user.id}/${route.params.id}`)
    messages.value = res.data.data
    await axios.put(`https://blog-backend-production-ad2a.up.railway.app/Message/read/${userStore.user.id}/${route.params.id}`)
    await nextTick()
    scrollToBottom()
}
async function sendMessage() {
    if(!newMessage.value.trim()) return

    await axios.post(`https://blog-backend-production-ad2a.up.railway.app/Message`,{
        senderId:userStore.user.id,
        receiverId:parseInt(route.params.id),
        content:newMessage.value
    })
    newMessage.value=''
    await loadMessages()
}
function scrollToBottom(){
    if(chatContainer.value){
        chatContainer.value.scrollTop=chatContainer.value.scrollHeight
    }
}
function formatDate(dateStr){
    if(!dateStr) return ''
    return dateStr.substring(0,16).replace('T',' ')
}
</script>

<template>
    <div class="message-detail">
        <h2>与{{otherUser.username}}对话</h2>
        <div class="chat-container" ref="chatContainer">
            <div v-for="msg in messages" :key="msg.id" :class="['chat-item',msg.senderId===userStore.user.id?'sent': 'received']">
                <img v-if="msg.senderId!==userStore.user.id" :src="msg.senderAvatar ||'https://via.placeholder.com/40'" class="avatar">
                <div class="chat-bubble">
                    <div class="chat-content">{{ msg.content }}</div>
                    <div class="chat-time">{{ formatDate(msg.createTime) }}</div>
                </div>
                <img v-if="msg.senderId===userStore.user.id" :src="msg.senderAvatar || 'https://via.placeholder.com/40'" class="avatar">
            </div>
            <div v-if="messages.length===0" class="empty">暂无消息</div>
        </div>
        <div class="input-area">
            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="输入消息...">
            <button @click="sendMessage">发送</button>
        </div>
    </div>
</template>
<style scoped>
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 10px;
}
.message-detail {
    max-width: 600px;
    margin: 20px auto;
    padding: 0 20px;
    height: 80vh;
    display: flex;
    flex-direction: column;
}

.chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px 0;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 20px;
}

.chat-item {
    margin-bottom: 15px;
    display: flex;
}

.chat-item.sent {
    justify-content: flex-end;
}

.chat-item.received {
    justify-content: flex-start;
}

.chat-bubble {
    max-width: 70%;
    padding: 10px 15px;
    border-radius: 12px;
}

.chat-item.sent .chat-bubble {
    background: #409eff;
    color: white;
}

.chat-item.received .chat-bubble {
    background: #f5f5f5;
    color: #333;
}

.chat-content {
    margin-bottom: 5px;
    word-wrap: break-word;
}

.chat-time {
    font-size: 12px;
    opacity: 0.7;
}

.input-area {
    display: flex;
    gap: 10px;
}

.input-area input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.input-area button {
    padding: 10px 20px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.input-area button:hover {
    background: #66b1ff;
}

.empty {
    text-align: center;
    color: #999;
    padding: 40px;
}
</style>