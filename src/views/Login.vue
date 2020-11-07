<template>
    <div class="login">
        <div class="loginbox">
            <p class="title">CSI语音技术吧</p>
            <el-form  v-show="showLogin" ref="loginForm" :rules="rule1" :model="loginForm" label-width="80px" class="form">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" show-password></el-input>
                </el-form-item>
                <el-row class="my-row row">
                    <el-checkbox v-model="checked">记住我</el-checkbox>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即登录</el-button>
                    <el-button @click="showLogin = false">注册</el-button>
                </el-form-item>
            </el-form>
            <!-- 注册表单 -->
            <el-form  v-show="!showLogin" ref="registerForm" :rules="rules" :model="registerForm" label-width="80px" class="form">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerForm.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password2">
                    <el-input v-model="registerForm.password2" show-password></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="registerForm.sex" class="select" placeholder="请选择性别">
                        <el-option label="男" value="0"></el-option>
                        <el-option label="女" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="registerForm.age"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onRegister('registerForm')">立即注册</el-button>
                    <el-button @click="showLogin = true">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        var checkAge = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('年龄不能为空'));
            } else if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'));
            } else {
                if (value < 0 || value > 100) {
                    callback(new Error('请输入有效的年龄'));
                } else {
                    callback();
                }
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        var checkEmail = (rule, value, callback) => {
            var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (value === '') {
                callback(new Error('请输入邮箱'));
            } else if (!myreg.test(value)) {
                callback(new Error('请输入正确的邮箱'));
            } else {
                callback();
            }
        };
        var checkusername = async (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } 
            let {data:res} = await this.$http.get(`/searchusername/${value}`)
            if(res.rs.length>0){
                callback(new Error('该用户名已存在'));
            }else{
                callback();
            }
        };
        return{
            showLogin:true,
            loginForm:{
                username:'',
                password:''
            },
            registerForm:{
                username:'',
                password:'',
                password2:'',
                sex:'',
                age:'',
                email:''
            },
            rule1: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'change' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'change' }
                ],
            },
            rules: {
                username: [
                    { required: true, validator: checkusername, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'change' }
                ],
                sex: [
                    { required: true, message: '性别不能为空', trigger: 'change' }
                ],
                password2: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                age: [
                    { required: true, validator: checkAge, trigger: 'blur' }
                ],
                email:[
                    { required: true, validator: checkEmail, trigger: 'blur' }
                ]
            },
            checked:false
        }
    },
    created(){
        if(localStorage.getItem('username')){
            this.loginForm.username = localStorage.getItem('username')
            this.loginForm.password = localStorage.getItem('password')
        }
    },
    methods:{
        async onSubmit() {
            // loginForm
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    let data = this.loginForm
                    let {data:res} = await this.$http.post('/login',data)
                    if(res.code==200){
                        this.$message.success('登录成功')
                        // 更新用户登录时间
                        this.$http.post('/updatelogintime',{id:res.id})
                        sessionStorage.setItem("id", res.id)
                        sessionStorage.setItem("username", res.username)
                        sessionStorage.setItem("isadmin", res.isadmin)
                        if(this.checked){
                            localStorage.setItem('username',res.username)
                            localStorage.setItem('password',this.loginForm.password)
                        }else{
                            localStorage.removeItem('username')
                            localStorage.removeItem('password')
                        }
                        this.$router.push('/home')
                    }else{
                        this.$message.error('用户名或密码错误')
                    }
                } else {
                    this.$message.error('信息有误')
                    return false;
                }
            });
        },
        onRegister(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let data = this.registerForm
                    let {data:res} = await this.$http.post('/register',data)
                    if(res.code==200){
                        this.showLogin = true
                        this.$message.success('注册成功')
                    }else{
                        this.$message.error('注册失败')
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
.login{
    width: 100%;
    height: 100%;
    background: linear-gradient(60deg,#56CCF2 ,#2F80ED);
}
.loginbox{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 500px;
    padding-bottom: 40px;
    border-radius: 20px;
    backdrop-filter: blur(30px);
    background-color: rgba(255, 255, 255, .2);
    box-shadow: rgba(0,0,0,.2) 0 0 15px;
}
.title{
    text-align: center;
    font-size: 40px;
    color: #252525;
}
.form{
    width: 400px;
    margin: 0 auto;
}
.select{
    width: 100%;
}
.row{
    margin-left: 80px;
}
</style>
