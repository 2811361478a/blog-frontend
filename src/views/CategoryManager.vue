<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';


const categories=ref([])
const newName=ref('')
const editId=ref(null)
const editName=ref('')

onMounted(()=>{
    loadCategories()
})
async function loadCategories() {
    const res =await axios.get(`https://blog-backend-production-ad2a.up.railway.app/Category`)
    categories.value=res.data.data
}
async function addCategory() {
    await axios.post(`https://blog-backend-production-ad2a.up.railway.app/Category`,{name:newName.value})
    newName.value=''
    loadCategories();
}
function startEdit(id,name){
    editId.value=id;
    editName.value=name;
} 
async function saveEdit() {
    await axios.put(`https://blog-backend-production-ad2a.up.railway.app/Category/${editId.value}`,{name:editName.value})
    editId.value=null
    editName.value=''
    loadCategories()
}
async function deleteCategory(id) {
    await axios.delete(`https://blog-backend-production-ad2a.up.railway.app/Category/${id}`)
    loadCategories()
}

</script>
<template>
    <div class="category-manager">
        <h2>分类管理</h2>
      <div class="add-category">
        <input v-model="newName" placeholder="请输入分类名称"/>
        <button @click="addCategory"> 添加</button>
      </div>
      <div class="category-list">
        <div v-for="c in categories" :key="c.id" class="category-item">
            <template v-if="editId===c.id">
                <input v-model="editName"/>
                <button @click="saveEdit">保存</button>
                <button @click="editId=null">取消</button>
            </template>
            <template v-else>
                <span>{{ c.name }}</span>
                <button @click="startEdit(c.id,c.name)">编辑</button>
                <button @click="deleteCategory(c.id)">删除</button>
            </template>
        </div>
      </div>
    </div>
</template>