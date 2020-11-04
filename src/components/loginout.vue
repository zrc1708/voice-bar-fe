<template>
    <span>
        <span class="loginout-title">欢迎，{{username}}</span>
        <el-button size="mini" class="loginout-btn" @click="loginout">登出</el-button>
    </span>
</template>

<script>
export default {
    data(){
        return{
            username:''
        }
    },
    created(){
        this.username = window.sessionStorage.getItem('username')
    },
    methods:{
        loginout(){
            sessionStorage.clear()
            this.$router.push('/')
        }
    }
}
</script>

<style lang="less" scoped>
.loginout-title{
    line-height: 60px;
}
.loginout-btn{
    margin-left: 20px;
}
</style>