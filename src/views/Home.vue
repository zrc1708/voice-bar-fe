<template>
    <div class="home">
        <el-container class="container">
            <el-header class="header">
                <span class="logo">CSI语音技术吧</span>
                <my-loginout></my-loginout>
            </el-header>
            <el-container>
                <el-aside width="200px" class="aside">
                    <el-menu router :default-active='defaultActive'>
                        <el-menu-item index="/home/allarticles">
                            <i class="el-icon-tickets"></i>
                            <span slot="title">所有文章</span>
                        </el-menu-item>
                        <el-menu-item index="/home/myarticle">
                            <i class="el-icon-edit-outline"></i>
                            <span slot="title">我的文章</span>
                        </el-menu-item>
                        <el-menu-item index="/home/mycomments">
                            <i class="el-icon-chat-line-round"></i>
                            <span slot="title">我的评论</span>
                        </el-menu-item>
                        <el-menu-item index="/home/voicesetting">
                            <i class="el-icon-setting"></i>
                            <span slot="title">语音设置</span>
                        </el-menu-item>
                        <el-menu-item index="/home/mysetting">
                            <i class="el-icon-user"></i>
                            <span slot="title">个人设置</span>
                        </el-menu-item>
                        <el-menu-item index="/home/upload">
                            <i class="el-icon-upload2"></i>
                            <span slot="title">上传头像</span>
                        </el-menu-item>
                        <el-menu-item index="/home/allusers" v-if="isadmin">
                            <i class="el-icon-document"></i>
                            <span slot="title">用户管理</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
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
            defaultActive: ''
        }
    },
    created(){
        this.defaultActive = this.$router.history.current.path
    },
    computed:{
        isadmin(){
            return sessionStorage.getItem('isadmin')
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
