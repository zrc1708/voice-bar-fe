<template>
    <el-card class="my-card">
        <div class="myarticle" v-show="showMyarticle">
            <el-row class="my-row">
                <el-input class="my-input" v-model="searchInput" placeholder="请输入标题"></el-input>
                <el-button @click="search">搜索</el-button>
            </el-row>
            <el-row class="my-row">
                <el-button @click="showMyarticle = false">发表文章</el-button>
            </el-row>
            <el-table :data="dataList" stripe border style="width: 100%">
                <el-table-column prop="views" label="阅读人数">
                </el-table-column>
                <el-table-column prop="commits" label="评论人数">
                </el-table-column>
                <el-table-column prop="title" label="文章标题">
                </el-table-column>
                <el-table-column label="发表日期">
                    <template slot-scope="scope">
                        {{scope.row.posttime | toMydate}}
                    </template>
                </el-table-column>
                <el-table-column label="最新评论日期">
                    <template slot-scope="scope">
                        {{scope.row.latestcommit | toMydate}}
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="作者">
                    <template slot-scope="scope">
                        {{scope.row.username}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="readArticle(scope.row)" size="mini">阅读</el-button>
                        <el-button @click="deleteArticle(scope.row)" size="mini" v-if="isadmin">删除</el-button>
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
        </div>

        <div class="push" v-show="!showMyarticle">
            <el-row class="my-row">
                <el-input class="my-input2" v-model="form.title" placeholder="文章标题"></el-input>
            </el-row>
            <el-row class="my-row">
                <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入内容"
                    v-model="form.content">
                </el-input>
            </el-row>
            <el-row class="my-row">
                <el-button type="primary"  @click="publish">发表</el-button>
                <el-button @click="showMyarticle = true">返回</el-button>
            </el-row>
        </div>
    </el-card>
</template>
<script>
export default {
    data(){
        return{
            searchInput:'',
            dataList:[],
            showMyarticle:true,
            form:{
                title:'',
                content:''
            },
            currentPage: 1,
            pageSize:10,
            total:0,
            showpage:true
        }
    },
    computed:{
        isadmin(){
            return sessionStorage.getItem('isadmin')==1
        }
    },
    filters: {
        toMydate: function (value) {
            if (!value) return '-'
            return (new Date(value)).toLocaleString()
        },
        toName: function(value) {
            return value==sessionStorage.getItem('id')?sessionStorage.getItem('username'):'未知'
        }
    },
    created(){
        this.getTotal()
        this.getAllArticle(1)
    },
    methods:{
        async getTotal(){
            let {data:res} = await this.$http.get(`/getallarticlescount`)
            if(res.code==200){
                this.total = res.total
            }else{
                this.$message.error('获取失败')
            }
        },
        async getAllArticle(currentPage){
            let pageSize = this.pageSize
            let {data:res} = await this.$http.get(`/getallarticles/${currentPage}/${pageSize}`)
            if(res.code==200){
                this.dataList = res.rs
            }else{
                this.$message.error('获取失败')
            }
            // console.log(this.dataList);
        },
        async publish(){
            if(this.form.title==''){
                this.$message.error('标题不能为空')
                return
            }
            if(this.form.content==''){
                this.$message.error('内容不能为空')
                return
            }
            let data = this.form
            data.id = sessionStorage.getItem('id')

            let {data:res} = await this.$http.post('/publish',data)
            if(res.code==200){
                this.$message.success('发表成功')
                this.getTotal()
                this.getAllArticle(1)
                this.form = {}
                this.showMyarticle = true
            }else{
                this.$message.error('发表失败')
            }
        },
        readArticle(item){
            this.$http.get(`/addviews/${item.id}/${item.views}`)
            this.$router.push(`/home/readarticle/${item.id}`)
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.getAllArticle(val)
        },
        async search(){
            if(this.searchInput==''){
                this.getAllArticle(1)
                this.showpage = true
                return
            }
            let searchInput = this.searchInput
            let {data:res} = await this.$http.get(`/searchAllArticle/${searchInput}`)
            if(res.code==200){
                this.dataList = res.rs
                this.showpage = false
                this.searchInput = ''
            }else{
                this.$message.error('获取失败')
            }
        },
        deleteArticle(item){
            console.log(item);
            this.$confirm(`此操作将删除此文章, 是否继续?`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async() => {
                let {data:res} = await this.$http.post('/admdeletearticle',item)
                if(res.code==200){
                    this.$message.success('删除成功')
                }else{
                    this.$message.error('删除失败')
                }
                this.getTotal()
                this.getAllArticle(1)
                
            }).catch(() => {});
        }
    }
}
</script>
<style lang="less" scoped>

</style>