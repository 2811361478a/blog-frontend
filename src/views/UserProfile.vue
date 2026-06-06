<script setup>
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
const userStore=useUserStore()
const userInfo=ref({
    username:'',
    createTime:''
})
const newUsername=ref('')
const usernameMessage=ref('')

const oldPassword=ref('')
const newPassword=ref('')
const confirmPassword=ref('')
const passwordMessage=ref('')

onMounted(async()=>{
    const res=await axios.get(`https://blog-backend-production-ad2a.up.railway.app/Users/${userStore.user.id}`)
     userInfo.value=res.data.data
})
async function updateUsername() {
    if(!newUsername.value.trim()){
        usernameMessage.value='用户名不能为空'
        return
    }
    try{
        const res=await axios.put(`https://blog-backend-production-ad2a.up.railway.app/Users/${userStore.user.id}`,
        {username: newUsername.value,
        pwd: userStore.user.pwd})
        if(res.data.code===200){
            usernameMessage.value='修改成功'
            userStore.user.username=newUsername.value
            newUsername.value=''
        }else{
            usernameMessage.value='修改失败'
        }
    }catch(e){
            usernameMessage.value='修改失败'
        }
    
}
async function updatePassword() {
    if(!oldPassword.value||!newPassword.value||!confirmPassword.value){
        passwordMessage.value='请填写所有密码字段'
        return
    }
    if(newPassword.value!==confirmPassword.value){
        passwordMessage.value='两次输入不一致'
        return
    }
    if(oldPassword.value!==userStore.user.pwd){
        passwordMessage.value='旧密码错误'
        return
    }
    try{
        const res=await axios.put(`https://blog-backend-production-ad2a.up.railway.app/Users/${userStore.user.id}`,
        {username:userStore.user.username,
         pwd:newPassword.value})
         if(res.data.code===200){
            passwordMessage.value='修改成功'
            userStore.user.pwd=newPassword.value
            oldPassword.value=''
            newPassword.value=''
            confirmPassword.value=''
            
         }else{
            passwordMessage.value=res.data.message
         }
    }catch(e){
        passwordMessage.value='修改失败'
    }
}

async function uploadAvatar(e) {
    const file=e.target.files[0]
    if(!file) return
    const formData=new FormData()
    formData.append('file',file)
    formData.append('oldAvatar',userInfo.value.avatar||'')
    const res=await axios.post(`https://blog-backend-production-ad2a.up.railway.app/File/upload`,formData)
    const avatarUrl=res.data.data

    await axios.put(`https://blog-backend-production-ad2a.up.railway.app/Users/${userStore.user.id}`,{
        username:userStore.user.username,
        pwd:userStore.user.pwd,
        avatar:avatarUrl
    })
    userInfo.value.avatar=avatarUrl
    userStore.user.avatar=avatarUrl
}
</script>
<template>
    <div class="profile">
        <h2>个人中心</h2>
        <div class="avatar-section">
            <img :src="userInfo.avatar ||`https://via.placeholder.com/100`" alt="头像" class="avatar"> 
            <div class="upload-wrapper">
                <label class="upload-btn">
                📷更换头像
                <input type="file" @change="uploadAvatar" accept="image/*" hidden class="file-input">
            </label>
            </div>
            
        </div>
        <div class="info-section">
            <p><strong>用户名：</strong>{{ userInfo.username }}</p>
            <p><strong>注册时间</strong>{{ userInfo.createTime?.substring(0,10) }}</p>
        </div>
        <div class="section">
            <h3>我的文章</h3>
            <router-link :to="`/posts?authorId=${userStore.user.id}`" class="my-posts-link">
                查看我的文章👉
            </router-link>
        </div>
        <div class="section">
            <h3>修改用户名</h3>
            <div class="form-row">
                <input v-model="newUsername" placeholder="请输入新用户名">
                <button @click="updateUsername">保存</button>
            </div>
            <p v-if="usernameMessage" :class="{error:usernameMessage.includes('失败')
                ||usernameMessage.includes('不能')}">{{ usernameMessage }}
            </p>
        </div>
        <div class="section">
            <h3>修改密码</h3>
            <input v-model="oldPassword" type="password" placeholder="请输入旧密码">
            <input v-model="newPassword" type="password" placeholder="请输入新密码">
            <input v-model="confirmPassword" type="password" placeholder="再次输入新密码">
            <button @click="updatePassword">保存</button>
            <p v-if="passwordMessage" :class="{error: passwordMessage.includes('失败')
                ||passwordMessage.includes('错误')||passwordMessage.includes('填写')}">
                {{ passwordMessage }}
            </p>
        </div>
    </div>
</template>
<style scoped>
.profile {
  max-width: 600px;
  margin: 20px auto;
  padding: 0 20px;
}

.info-section {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.section h3 {
  margin-bottom: 15px;
  color: #333;
}

.form-row {
  display: flex;
  gap: 10px;
}
.form-row input {
  flex: 1;
  margin-bottom: 0;
}

.form-row button {
  flex-shrink: 0;
  white-space: nowrap;  /* 按钮文字不换行 */
}
input {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
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

.error {
  color: #f56c6c;
  font-size: 14px;
  margin-top: 5px;
}

p {
  color: #67c23a;
  font-size: 14px;
  margin-top: 5px;
}
.my-posts-link {
  display: inline-block;
  padding: 10px 20px;
  background: #409eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 10px;
}

.my-posts-link:hover {
  background: #66b1ff;
}
.avatar-section {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  border: 3px solid #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.upload-wrapper {
  display: inline-block;
}

.upload-btn {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}
.file-input {
  display: none;  /* 完全隐藏 input */
}
</style>