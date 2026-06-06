import {login as loginApi} from '@/api'
import { defineStore } from "pinia";
import {  ref } from "vue";
export const useUserStore=defineStore('user',()=>{
    const user=ref(null)
    async function login({username,pwd}){
        const res=await loginApi({username,pwd})
        if(res.data.code===200){
            user.value=res.data.data
        }
        return res.data
    }
    function logout(){
        user.value=null
    }
    return {user,login,logout}
})