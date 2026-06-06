<script setup>
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import {  useRouter } from 'vue-router';

const userStore=useUserStore()
const router=useRouter()
const messages=ref([])
const tab=ref('received')

onMounted(()=>{
    loadMessages()
})
async function loadMessages() {
    if(tab.value=='received'){
       const res=await axios.get(`http://localhost:8080/Message/receive/${userStore.user.id}`) 
       messages.value=res.data.data
    }else{
        const res=await axios.get(`http://localhost:8080/Message/send/${userStore.user.id}`)
        messages.value=res.data.data
    }
}
function changeTab(t){
    tab.value=t
    loadMessages()
}
function openChat(userId){
    router.push(`/message/${userId}`)
}
function formatDate(dateStr){
    if(!dateStr) return ''
    return dateStr.substring(0,16).replace('T',' ')
}
</script>
<template>
    <div class="message-list">
        <h2>消息中心</h2>
        <div class="tabs">
          <button @click="changeTab('received')" :class="{active :tab==='received'}">收件箱</button>
          <button @click="changeTab('sent')" :class="{active :tab==='sent'}">发件箱</button>
        </div>
      <div class="message-items">
        <div v-for="msg in messages" :key="msg.id" class="message-item" @click="openChat(tab==='received' ? msg.senderId : msg.receiverId)">
            <div class="message-info">
                <span class="name">{{ tab==='received' ? msg.senderName : msg.receiverName }}</span>
                <span class="time">{{ formatDate(msg.createTime) }}</span>
            </div>
            <div class="message-preview">{{ msg.content }}</div>
            <div v-if="tab==='received'&& !msg.isRead" class="unread">未读</div>
        </div>
        <div v-if="messages.length===0" class="empty">暂无消息</div>
      </div>
    </div>
    
</template>
<style scoped>
.message-list {
    max-width: 600px;
    margin: 20px auto;
    padding: 0 20px;
}

.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tabs button {
    padding: 8px 20px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
}

.tabs button.active {
    background: #409eff;
    color: white;
    border-color: #409eff;
}

.message-item {
    padding: 15px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    position: relative;
}

.message-item:hover {
    background: #f5f5f5;
}

.message-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.name {
    font-weight: bold;
    color: #333;
}

.time {
    color: #999;
    font-size: 14px;
}

.message-preview {
    color: #666;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.unread {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #f56c6c;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
}

.empty {
    text-align: center;
    color: #999;
    padding: 40px;
}
</style>