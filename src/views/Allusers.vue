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
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="readArticle(scope.row)" size="mini">删除</el-button>
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
    </el-card>
</template>
<script>
export default {
    data(){
        return{
            searchInput:'',
            dataList:[],
            currentPage: 1,
            pageSize:10,
            total:0,
            showpage:true
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
    }
}
</script>
<style lang="less" scoped>

</style>