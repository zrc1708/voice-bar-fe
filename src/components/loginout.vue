<template>
    <span>
        <span class="loginout-title">欢迎，{{username}}</span>
        <el-button size="mini" class="loginout-btn" @click="changepassword">修改密码</el-button>
        <el-button size="mini" class="loginout-btn" @click="loginout">登出</el-button>

        <el-dialog
            title="修改密码"
            :visible.sync="dialogVisible"
            width="50%">

            <el-form  ref="registerForm" :rules="rules" :model="registerForm" label-width="90px" class="form">
                <el-form-item label="当前密码">
                    <el-input v-model="registerForm.oldpassword" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input v-model="registerForm.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="password2">
                    <el-input v-model="registerForm.password2" show-password></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="hide">取 消</el-button>
                <el-button type="primary" @click="onRegister('registerForm')">确 定</el-button>
            </span>
        </el-dialog>
    </span>
</template>

<script>
export default {
    data(){
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return{
            username:'',
            dialogVisible:false,
            registerForm:{
                oldpassword:'',
                password:'',
                password2:''
            },
            rules: {
                password2: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                oldpassword: [
                    { type: 'date', required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
            }
        }
    },
    created(){
        this.username = window.sessionStorage.getItem('username')
    },
    methods:{
        loginout(){
            sessionStorage.clear()
            this.$router.push('/')
        },
        hide(){
            this.dialogVisible = false
            this.registerForm = {}
        },
        changepassword(){
            this.dialogVisible = true
        },
        onRegister(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let data = this.registerForm
                    data.id = sessionStorage.getItem('id')
                    let {data:res} = await this.$http.post('/changepassword',data)
                    if(res.code==200){
                        this.dialogVisible = false
                        this.$message.success('修改密码成功')
                    }else{
                        this.$message.error('修改密码失败，原密码错误')
                    }
                } else {
                    this.$message.error('信息有误')
                    return false;
                }
            });
        },
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