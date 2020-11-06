<template>
    <el-card class="my-card">
        <el-form ref="registerForm" :rules="rules" :model="form" label-width="80px" class="form">
            <el-form-item label="用户名">
                <el-input v-model="form.username" disabled class="my-input colorset"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="form.sex" class="select" placeholder="请选择性别">
                    <el-option label="男" :value="0"></el-option>
                    <el-option label="女" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input v-model.number="form.age" class="my-input"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" class="my-input"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onRegister('registerForm')">修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
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
        return{
            form:{
                username:'',
                sex:'',
                age:'',
                email:''
            },
            rules: {
                age: [
                    { validator: checkAge, trigger: 'blur' }
                ],
                email:[
                    { validator: checkEmail, trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.getUserSetting()
    },
    methods:{
        onRegister(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let data = this.form
                    data.id = sessionStorage.getItem('id')
                    let {data:res} = await this.$http.post('/updateusersetting',data)
                    if(res.code==200){
                        this.getUserSetting()
                        this.$message.success('修改成功')
                    }else{
                        this.$message.error('修改失败')
                    }
                } else {
                    this.$message.error('信息有误')
                    return false;
                }
            });
        },
        async getUserSetting(){
            let id = sessionStorage.getItem('id')
            let {data:res} = await this.$http.get(`/getusersetting/${id}`)
            if(res.code==200){
                this.form.username = res.rs.username
                this.form.sex = res.rs.sex
                this.form.age = res.rs.age
                this.form.email = res.rs.email
            }else{
                this.$message.error('获取失败')
            }
        }
    }
}
</script>
<style lang="less" scoped>


</style>