<template>
    <div class="home">
        <el-container class="container">
            <el-header class="header">
                <span class="logo">CSI语音技术吧</span>
                <my-loginout></my-loginout>
            </el-header>
            <el-container>
                <el-aside width="200px" class="aside">Aside</el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import loginout from '../components/loginout'

export default {
    components:{
      'my-loginout':loginout
    },
    data(){
        return{
            
        }
    },
    methods:{
        
    }
}
</script>

<style lang="less" scoped>
.home,.container{
    height: 100%;
}
.logo{
  line-height: 59px;
  font-size: 22px;
}
.header{
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
}
.aside{
    height: 100%;
    border-right: 1px solid #eee;
}
</style>
