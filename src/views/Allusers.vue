<template>
    <el-card class="my-card">
        <el-row class="my-row">
            <el-input class="my-input" v-model="searchInput" placeholder="请输入用户名"></el-input>
            <el-button @click="search">搜索</el-button>
        </el-row>
        <el-table :data="dataList" stripe border style="width: 100%">
            <el-table-column prop="username" label="用户名">
            </el-table-column>
            <el-table-column prop="age" label="年龄">
            </el-table-column>
            <el-table-column prop="sex" label="性别">
                <template slot-scope="scope">
                    {{scope.row.sex | toSex}}
                </template>
            </el-table-column>
            <el-table-column label="注册日期">
                <template slot-scope="scope">
                    {{scope.row.birthtime | toMydate}}
                </template>
            </el-table-column>
            <el-table-column label="最近登录日期">
                <template slot-scope="scope">
                    {{scope.row.logintime | toMydate}}
                </template>
            </el-table-column>
            <el-table-column label="权限">
                <template slot-scope="scope">
                    {{scope.row.isadm | toAdm}}
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    {{scope.row.state | toState}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="deleteUser(scope.row)" size="mini">删除</el-button>
                    <el-button @click="changeUser(scope.row)" size="mini">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="my-row" v-show="showpage">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-row>
        <!-- 编辑用户弹窗 -->
        <el-dialog
            title="回复"
            :visible.sync="dialogVisible"
            width="50%">

            <el-form ref="registerForm" :rules="rules" :model="registerForm" label-width="80px" class="form">
                <el-form-item label="用户名">
                    <el-input v-model="registerForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="registerForm.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="registerForm.sex" class="select" placeholder="请选择性别">
                        <el-option label="男" :value="0"></el-option>
                        <el-option label="女" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="registerForm.age"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <el-select v-model="registerForm.isadm" class="select" placeholder="请选择权限">
                        <el-option label="普通用户" :value="0"></el-option>
                        <el-option label="管理员" :value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onRegister('registerForm')">确 定</el-button>
            </span>
        </el-dialog>
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
        return{
            searchInput:'',
            dataList:[],
            currentPage: 1,
            pageSize:10,
            total:0,
            showpage:true,
            dialogVisible:false,
            registerForm:{
                username:'',
                password:'',
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
    filters: {
        toMydate: function (value) {
            if (!value) return '-'
            return (new Date(value)).toLocaleString()
        },
        toSex: function(value) {
            if(value==1){
                return '女'
            }else{
                return '男'
            }
        },
        toAdm: function(value) {
            if(value==1){
                return '管理员'
            }else{
                return '普通用户'
            }
        },
        toState: function(value) {
            if(value==1){
                return '已注销'
            }else{
                return '正常'
            }
        }
    },
    created(){
        this.getTotal()
        this.getAllUser(1)
    },
    methods:{
        async getTotal(){
            let {data:res} = await this.$http.get(`/countallusers`)
            if(res.code==200){
                this.total = res.total
            }else{
                this.$message.error('获取失败')
            }
        },
        async search(currentPage){
            if(this.searchInput==''){
                this.getAllUser(1)
                this.showpage = true
                return
            }
            let searchInput = this.searchInput
            let {data:res} = await this.$http.get(`/searchuser/${searchInput}`)
            if(res.code==200){
                this.dataList = res.rs
                this.showpage = false
                this.searchInput = ''
            }else{
                this.$message.error('获取失败')
            }
        },
        async getAllUser(currentPage){
            let pageSize = this.pageSize
            let {data:res} = await this.$http.get(`/getallusers/${currentPage}/${pageSize}`)
            if(res.code==200){
                this.dataList = res.rs
            }else{
                this.$message.error('获取失败')
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.getAllUser(val)
        },
        deleteUser(item){
            // console.log(item.id);
            this.$confirm(`此操作将删除用户${item.username}, 是否继续?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async() => {
                let {data:res} = await this.$http.post('/admdeleteuser',{id:item.id})
                if(res.code==200){
                    this.$message.success('删除成功')
                }else{
                    this.$message.error('删除失败')
                }
                this.getTotal()
                this.getAllUser(1)
            }).catch(() => {});
        },
        async changeUser(item){
            this.registerForm = item
            this.dialogVisible = true
        },
        onRegister(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let data = this.registerForm
                    let {data:res} = await this.$http.post('/adminupdateuser',data)
                    if(res.code==200){
                        this.$message.success('修改成功')
                    }else{
                        this.$message.error('修改失败')
                    }
                    this.dialogVisible = false
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

</style>